/**
 * Əks geokodlama — xəritədə seçilmiş nöqtəni ünvana çevirir.
 *
 * OpenStreetMap-in Nominatim xidməti istifadə olunur: pulsuz və API
 * açarı tələb etmir. Əvəzində istifadə qaydası var — saniyədə bir
 * sorğudan çox olmamalıdır. Ona görə çağıran tərəf gecikdirmə tətbiq
 * etməlidir (Locations səhifəsində 600 ms).
 *
 * Xidmət əlçatmaz olsa `null` qaytarılır — istifadəçi ünvanı əl ilə
 * yaza bilər, xəritə seçimi bloklanmır.
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse';

export interface ResolvedAddress {
  /** Küçə + bina, şəhər adı olmadan */
  address: string;
  city: string;
  /** Tam ünvan — tooltip və ya yoxlama üçün */
  display: string;
}

interface NominatimAddress {
  road?: string;
  house_number?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<ResolvedAddress | null> {
  const url =
    `${NOMINATIM}?format=jsonv2&lat=${lat}&lon=${lng}` +
    `&zoom=18&addressdetails=1&accept-language=az`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      display_name?: string;
      address?: NominatimAddress;
    };

    const parts = data.address ?? {};

    const street = parts.road ?? parts.pedestrian ?? parts.neighbourhood ?? parts.suburb ?? '';
    const houseNumber = parts.house_number ?? '';
    const address = [street, houseNumber].filter(Boolean).join(' ').trim();

    const city =
      parts.city ?? parts.town ?? parts.village ?? parts.municipality ?? parts.state ?? '';

    return {
      address: address || data.display_name?.split(',')[0] || '',
      city,
      display: data.display_name ?? '',
    };
  } catch {
    // AbortError və ya şəbəkə xətası — ünvan əl ilə yazıla bilər.
    return null;
  }
}

/** Bakının mərkəzi — xəritənin başlanğıc nöqtəsi. */
export const DEFAULT_MAP_CENTER: [number, number] = [40.4093, 49.8671];

// ─── Ünvan axtarışı (irəli geokodlama) ───────────────────────

export interface AddressSuggestion {
  /** Siyahıda göstərilən qısa ad */
  label: string;
  /** Tam ünvan — seçim təsdiqi üçün */
  display: string;
  latitude: number;
  longitude: number;
  /** Ünvan sahələrinə yazılacaq hissələr */
  address: string;
  city: string;
}

/**
 * Yazılan mətnə uyğun ünvanlar.
 *
 * Xəritəyə klikləmək dəqiqdir, amma adam ünvanı bilirsə onu yazmaq
 * daha sürətlidir. Axtarış Azərbaycanla məhdudlaşdırılıb: "Nərimanov"
 * yazan adam başqa ölkədəki eyniadlı yeri görməməlidir.
 *
 * Xəta olsa boş siyahı qayıdır — axtarış sahəsi istifadəçini
 * bloklamamalıdır.
 */
export async function searchAddress(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const text = query.trim();
  if (text.length < 3) return [];

  const url =
    'https://nominatim.openstreetmap.org/search' +
    '?format=jsonv2&addressdetails=1&limit=6&accept-language=az' +
    '&countrycodes=az' +
    `&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return [];

    const data = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
      address?: NominatimAddress;
    }>;

    if (!Array.isArray(data)) return [];

    return data
      .map((item): AddressSuggestion | null => {
        const latitude = Number(item.lat);
        const longitude = Number(item.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

        const display = item.display_name ?? '';
        if (!display) return null;

        const parts = item.address ?? {};
        const street =
          parts.road ?? parts.pedestrian ?? parts.neighbourhood ?? parts.suburb ?? '';
        const houseNumber = parts.house_number ?? '';

        return {
          // Tam ünvan uzundur və siyahını dağıdır; ilk üç hissə kifayətdir.
          label: display.split(',').slice(0, 3).map((part) => part.trim()).join(', '),
          display,
          latitude,
          longitude,
          address: [street, houseNumber].filter(Boolean).join(' ').trim(),
          city:
            parts.city ??
            parts.town ??
            parts.village ??
            parts.municipality ??
            parts.state ??
            '',
        };
      })
      .filter((item): item is AddressSuggestion => item !== null);
  } catch {
    return [];
  }
}
