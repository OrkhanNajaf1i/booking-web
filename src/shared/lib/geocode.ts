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
