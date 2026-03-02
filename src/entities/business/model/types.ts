export interface Business {
    business_type: string,
    created_at: string,
    id: string,
    industry: string,
    is_active: boolean,
    name: string,
    owner_id: string,
    phone: string,
    service_category: string,
    updated_at: string
}
 
export interface MultiBusinessDto {
    industry: string,
    name: string,
    phone: string
}
export interface SoloBusinessDto{
    name: string,
    phone: string,
    service_category: string
}