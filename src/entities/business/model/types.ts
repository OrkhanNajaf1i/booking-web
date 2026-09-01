export interface Business {
    business_type: string,
    created_at: string,
    id: string,
    industry: string,
    is_active: boolean,
    name: string,
    owner_id: string,
    phone: string,
    /** Kəşf ekranındakı sabit kateqoriya — qruplaşdırma buna baxır */
    category_slug: string,
    /** Həmin kateqoriyanın görünən adı */
    category_name: string,
    /** Sahibin öz sözü ("Kardioloq") — kartda alt başlıq */
    service_category: string,
    updated_at: string
}

/**
 * Biznesin ilk filialı — məcburidir.
 *
 * Biznes yaradıldığı an müştəri tətbiqində görünür. Ünvanı və
 * koordinatı olmasa kartda gedilən yer yazılmır, xəritədə nöqtəsi
 * çıxmır və "yaxınlıqdakılar" filtri onu atlayır.
 */
export interface LocationDraft {
    name?: string,
    address: string,
    city?: string,
    latitude: number,
    longitude: number
}

export interface MultiBusinessDto {
    industry: string,
    name: string,
    phone: string,
    category_slug: string,
    service_category: string,
    location: LocationDraft
}
export interface SoloBusinessDto{
    name: string,
    phone: string,
    category_slug: string,
    service_category: string,
    location: LocationDraft
}

/** Backend-dəki sabit dəyərlər — panel bunları olduğu kimi göndərir. */
export const BUSINESS_MODE = {
    solo: 'solo_practitioner',
    team: 'multi_staff_business',
} as const;

export type BusinessMode = (typeof BUSINESS_MODE)[keyof typeof BUSINESS_MODE];
export interface UpdateBusinessDTO {
  name?:     string;
  // Backend metn gozleyir: Number("+994...") NaN verirdi ve telefon itirdi.
  phone?:    string;
  industry?: string;
  category_slug?: string;
  service_category?: string;
}
