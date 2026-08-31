/**
 * Xəritədən ərazi seçimi.
 *
 * Üç yol var və üçü də lazımdır, çünki heç biri hər halda işləmir:
 *
 *   1. **Ünvan axtarışı** — sahib ünvanı bilirsə ən sürətli yol.
 *   2. **Xəritəyə toxunmaq** — küçənin adını bilməyəndə, amma yeri
 *      görəndə. Nişanı sürüşdürərək dəqiqləşdirmək olur.
 *   3. **Cari yer** — məkanda oturub qeydiyyatdan keçəndə.
 *
 * Seçim ünvan/şəhər sahələrini doldurur, amma onları kilidləmir:
 * geokodlama təxminidir, son sözü istifadəçi deyir.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Loader2, MapPin, Minus, Plus, Search, X } from 'lucide-react';

import {
  DEFAULT_MAP_CENTER,
  reverseGeocode,
  searchAddress,
  type AddressSuggestion,
  type ResolvedAddress,
} from '@/shared/lib/geocode';

// Leaflet-in default nişan şəkilləri bundler-də tapılmır (CSS onları
// nisbi yolla axtarır). Inline SVG ilə əvəz edirik — əlavə fayl lazım olmur.
const markerIcon = L.divIcon({
  className: '',
  html: `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1C8.3 1 2 7.3 2 15c0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z"
            fill="#0f766e" stroke="#ffffff" stroke-width="2"/>
      <circle cx="16" cy="15" r="5" fill="#ffffff"/>
    </svg>`,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
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

/**
 * Xəritəni proqramla hərəkət etdirir.
 *
 * `MapContainer`-in `center` sahəsi yalnız ilk qurulanda oxunur —
 * axtarışdan gələn nöqtəyə keçmək üçün xəritəyə birbaşa müraciət
 * lazımdır.
 */
function MapMover({
  target,
}: {
  target: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.6 });
  }, [target, map]);

  return null;
}

/** Yaxınlaşdırma düymələri — trackpad-siz istifadəçi üçün. */
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute top-3 right-3 z-400 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Yaxınlaşdır"
        className="flex size-8 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50"
      >
        <Plus size={15} />
      </button>
      <span className="h-px bg-slate-200" />
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Uzaqlaşdır"
        className="flex size-8 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50"
      >
        <Minus size={15} />
      </button>
    </div>
  );
}

export function LocationPicker({ value, onPick, height = 300 }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null,
  );
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);
  const [locating, setLocating] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(
    null,
  );

  // Axtarış
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  // Nominatim saniyədə bir sorğu qaydası qoyur — hər hərfdə/klikdə
  // dərhal getməsin deyə gecikdiririk və köhnə sorğunu ləğv edirik.
  const reverseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reverseAbort = useRef<AbortController | null>(null);
  const searchAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (reverseTimer.current) clearTimeout(reverseTimer.current);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      reverseAbort.current?.abort();
      searchAbort.current?.abort();
    };
  }, []);

  /** Xəritədən, sürüşdürmədən və ya cari yerdən gələn nöqtə. */
  const applyPoint = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setResolved(null);
    setSuggestions([]);

    // Koordinat dərhal ötürülür; ünvan sonra gəlir.
    onPick({ lat, lng });

    if (reverseTimer.current) clearTimeout(reverseTimer.current);
    reverseAbort.current?.abort();

    setResolving(true);
    reverseTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      reverseAbort.current = controller;

      const address = await reverseGeocode(lat, lng, controller.signal);
      setResolving(false);

      if (address) {
        setResolved(address);
        onPick({ lat, lng, address: address.address, city: address.city });
      }
    }, 600);
  };

  const handleSearchChange = (text: string) => {
    setQuery(text);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchAbort.current?.abort();

    if (text.trim().length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      searchAbort.current = controller;

      const results = await searchAddress(text, controller.signal);
      setSuggestions(results);
      setSearching(false);
    }, 500);
  };

  const pickSuggestion = (suggestion: AddressSuggestion) => {
    setPosition([suggestion.latitude, suggestion.longitude]);
    setResolved({
      address: suggestion.address,
      city: suggestion.city,
      display: suggestion.display,
    });
    setSuggestions([]);
    setQuery('');
    setFlyTo({ lat: suggestion.latitude, lng: suggestion.longitude, zoom: 17 });

    onPick({
      lat: suggestion.latitude,
      lng: suggestion.longitude,
      address: suggestion.address,
      city: suggestion.city,
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setLocating(false);
        applyPoint(result.coords.latitude, result.coords.longitude);
        setFlyTo({
          lat: result.coords.latitude,
          lng: result.coords.longitude,
          zoom: 17,
        });
      },
      // İcazə verilməsə heç nə olmur: xəritə və axtarış onsuz da var.
      () => setLocating(false),
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  const center = useMemo(() => position ?? DEFAULT_MAP_CENTER, [position]);

  return (
    <div className="space-y-2">
      {/* ── Ünvan axtarışı ──────────────────────────────── */}
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Ünvanı yazın: Nizami küç. 12, Bakı"
          className="h-9.5 w-full rounded-lg border border-input bg-white pr-9 pl-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none dark:bg-slate-900 dark:text-slate-100"
        />
        {searching ? (
          <Loader2
            size={15}
            className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-slate-400"
          />
        ) : (
          query && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              aria-label="Axtarışı təmizlə"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )
        )}

        {suggestions.length > 0 && (
          <ul className="absolute z-500 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.latitude},${suggestion.longitude}`}>
                <button
                  type="button"
                  onClick={() => pickSuggestion(suggestion)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
                  <span className="text-slate-700">{suggestion.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length >= 3 && !searching && suggestions.length === 0 && (
          <p className="mt-1 text-xs text-slate-500">
            Ünvan tapılmadı — xəritədən seçə bilərsiniz.
          </p>
        )}
      </div>

      {/* ── Xəritə ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={position ? 16 : 12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <ClickHandler onClick={applyPoint} />
          <MapMover target={flyTo} />
          <ZoomControls />

          {position && (
            <Marker
              position={position}
              icon={markerIcon}
              // Sürüşdürmə dəqiqləşdirmə üçündür: klik təxmini yeri
              // verir, sürüşdürmə isə binanın küncünə qədər dəqiqləşdirir.
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng();
                  applyPoint(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="absolute bottom-3 left-3 z-400 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          {locating ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Crosshair size={13} />
          )}
          Cari yerim
        </button>
      </div>

      {/* ── Vəziyyət ────────────────────────────────────── */}
      <div className="flex items-start gap-1.5 text-xs text-slate-500">
        {resolving ? (
          <>
            <Loader2 size={12} className="mt-0.5 shrink-0 animate-spin" />
            <span>Ünvan tapılır…</span>
          </>
        ) : position ? (
          <>
            <MapPin size={12} className="mt-0.5 shrink-0 text-brand-700" />
            <span>
              {resolved?.display ?? 'Nöqtə seçildi'}
              <span className="tabular ml-1.5 text-slate-400">
                ({position[0].toFixed(5)}, {position[1].toFixed(5)})
              </span>
            </span>
          </>
        ) : (
          <>
            <MapPin size={12} className="mt-0.5 shrink-0" />
            <span>Ünvanı yazın, xəritəyə toxunun və ya nişanı sürüşdürün.</span>
          </>
        )}
      </div>
    </div>
  );
}
