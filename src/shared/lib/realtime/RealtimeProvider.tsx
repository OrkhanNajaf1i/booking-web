/**
 * Realtime bağlantı — bütün tətbiq üçün bir WebSocket.
 *
 * Bağlantı qopanda eksponensial geri çəkilmə ilə özü qoşulur.
 * Gələn hər hadisə həm abunəçilərə paylanır, həm də əlaqəli
 * react-query keşlərini invalidasiya edir ki, ekran öz-özünə yenilənsin.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { RealtimeEnvelope } from '@/entities/notification/model/types';

type EventHandler = (event: RealtimeEnvelope) => void;

interface RealtimeContextValue {
  /** WebSocket açıqdırmı — UI-da "canlı" göstəricisi üçün. */
  connected: boolean;
  /** Hadisələrə abunə olur; təmizləyici funksiya qaytarır. */
  subscribe: (handler: EventHandler) => () => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  connected: false,
  subscribe: () => () => {},
});

/** HTTP baza URL-indən WebSocket URL-i qurur. */
function buildSocketUrl(token: string): string {
  const base =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  const wsBase = base.replace(/^http/, 'ws');
  return `${wsBase}/ws?token=${encodeURIComponent(token)}`;
}

// Yenidən qoşulma gecikmələri (ms). Sonuncu təkrarlanır.
const RECONNECT_DELAYS = [1_000, 2_000, 5_000, 10_000, 30_000];

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<EventHandler>>(new Set());
  const attemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Komponent söküləndə yenidən qoşulmanı dayandırmaq üçün.
  const disposedRef = useRef(false);

  const subscribe = useCallback((handler: EventHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const handleEvent = useCallback(
    (event: RealtimeEnvelope) => {
      if (event.type === 'connection.ready') return;

      // Bildiriş sayğacı və siyahılar dərhal yenilənsin.
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      // Vaxt tutulduqda/boşaldıqda seçim ekranı köhnə qalmasın.
      if (
        event.type === 'booking.created' ||
        event.type === 'booking.cancelled' ||
        event.type === 'booking.confirmed' ||
        event.type === 'booking.reschedule_accepted'
      ) {
        queryClient.invalidateQueries({ queryKey: ['availability'] });
      }

      toast(event.title, { description: event.body });

      handlersRef.current.forEach((handler) => handler(event));
    },
    [queryClient]
  );

  const connect = useCallback(() => {
    if (disposedRef.current) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Hələ login olunmayıb — sonra yenidən cəhd edilir.
      scheduleReconnect();
      return;
    }

    // Köhnə bağlantı qalıbsa bağlanır.
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    const socket = new WebSocket(buildSocketUrl(token));
    socketRef.current = socket;

    socket.onopen = () => {
      attemptRef.current = 0;
      setConnected(true);
    };

    socket.onmessage = (message) => {
      try {
        handleEvent(JSON.parse(message.data) as RealtimeEnvelope);
      } catch {
        // Formatı pozulmuş mesaj bağlantını qırmamalıdır.
      }
    };

    socket.onerror = () => {
      // onclose onsuz da çağırılacaq; burada iş görmürük.
    };

    socket.onclose = () => {
      setConnected(false);
      socketRef.current = null;
      scheduleReconnect();
    };

    function scheduleReconnect() {
      if (disposedRef.current) return;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

      const delay =
        RECONNECT_DELAYS[Math.min(attemptRef.current, RECONNECT_DELAYS.length - 1)];
      attemptRef.current += 1;

      reconnectTimerRef.current = setTimeout(connect, delay);
    }
  }, [handleEvent]);

  useEffect(() => {
    disposedRef.current = false;
    connect();

    return () => {
      disposedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const value = useMemo(() => ({ connected, subscribe }), [connected, subscribe]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

/** Realtime vəziyyətinə və hadisələrinə giriş. */
export function useRealtime() {
  return useContext(RealtimeContext);
}

/** Konkret hadisə növlərinə abunə olmaq üçün rahat hook. */
export function useRealtimeEvent(
  types: RealtimeEnvelope['type'][],
  handler: EventHandler
) {
  const { subscribe } = useRealtime();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return subscribe((event) => {
      if (types.includes(event.type)) handlerRef.current(event);
    });
    // types massivi hər render-də yeni referens ola bilər — məzmununa baxırıq.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe, types.join(',')]);
}
