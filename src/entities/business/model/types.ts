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

export interface MultiBusinessDto {
    industry: string,
    name: string,
    phone: string,
    category_slug: string,
    service_category: string
}
export interface SoloBusinessDto{
    name: string,
    phone: string,
    category_slug: string,
    service_category: string
}
export interface UpdateBusinessDTO {
  name?:     string;
  // Backend metn gozleyir: Number("+994...") NaN verirdi ve telefon itirdi.
  phone?:    string;
  industry?: string;
  category_slug?: string;
  service_category?: string;
}
