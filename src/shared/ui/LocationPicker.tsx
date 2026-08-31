/**
 * Xəritədən ərazi seçimi.
 *
 * Xəritəyə toxunanda nişan həmin nöqtəyə keçir və əks geokodlama ilə
 * ünvan/şəhər sahələri avtomatik dolur. İstifadəçi doldurulan mətni
 * sonradan əl ilə düzəldə bilər — geokodlama təxminidir, son sözü
 * istifadəçi deyir.
 */
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin } from 'lucide-react';

import {
  DEFAULT_MAP_CENTER,
  reverseGeocode,
  type ResolvedAddress,
} from '@/shared/lib/geocode';

// Leaflet-in default nişan şəkilləri bundler-də tapılmır (CSS onları
// nisbi yolla axtarır). Inline SVG ilə əvəz edirik — əlavə fayl lazım olmur.
const markerIcon = L.divIcon({
  className: '',
  html: `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 25 15 25s15-14 15-25c0-8.3-6.7-15-15-15z"
            fill="#171717"/>
      <circle cx="15" cy="15" r="5.5" fill="#fff"/>
    </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
}

interface Props {
  value?: { lat: number; lng: number } | null;
  onPick: (picked: PickedLocation) => void;
  height?: number;
}

/** Xəritə kliklərini tutan köməkçi — MapContainer-in içində olmalıdır. */
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (event) => onClick(event.latlng.lat, event.latlng.lng),
  });
  return null;
}

export function LocationPicker({ value, onPick, height = 260 }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null,
  );
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);

  // Nominatim saniyədə bir sorğu qaydası qoyur — hər klikdə dərhal
  // getməsin deyə gecikdiririk və köhnə sorğunu ləğv edirik.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const handlePick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setResolved(null);

    // Koordinat dərhal ötürülür; ünvan sonra gəlir.
    onPick({ lat, lng });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    setResolving(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      const address = await reverseGeocode(lat, lng, controller.signal);
      setResolving(false);

      if (address) {
        setResolved(address);
        onPick({ lat, lng, address: address.address, city: address.city });
      }
    }, 600);
  };

  const center = position ?? DEFAULT_MAP_CENTER;

  return (
    <div className="space-y-2">
      <div
        className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={position ? 16 : 12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={handlePick} />
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        {resolving ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Ünvan tapılır…
          </>
        ) : position ? (
          <>
            <MapPin size={12} />
            {resolved?.display
              ? resolved.display
              : `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}
          </>
        ) : (
          <>
            <MapPin size={12} />
            Filialın yerini seçmək üçün xəritəyə toxunun
          </>
        )}
      </p>
    </div>
  );
}
