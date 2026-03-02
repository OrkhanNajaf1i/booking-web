// File: router/lib/path.ts

export const paths = {
  // ─── Auth (businessId tələb etmir) ───────────────────────────
  login:          () => `/login`,
  register:       () => `/register`,
  forgotPassword: () => `/forgot-password`,
  onboarding:     () => `/onboarding`,

  // ─── Error ───────────────────────────────────────────────────
  notFound: `/not-found`,

  // ─── Business-scoped (hər route businessId tələb edir) ───────
  // /api/v1/business  – biznes profili (GET, PUT)
  dashboard: (businessId: string) =>
    `/business/${businessId}/dashboard`,

  // /api/v1/bookings  – bron siyahısı + calendar
  bookings: (businessId: string) =>
    `/business/${businessId}/bookings`,

  // /api/v1/business  – biznes detalları
  business: (businessId: string) =>
    `/business/${businessId}/profile`,

  // /api/v1/locations – filial siyahısı
  locations: (businessId: string) =>
    `/business/${businessId}/locations`,

  // /api/v1/locations/{id}
  locationDetail: (businessId: string, locationId: string) =>
    `/business/${businessId}/locations/${locationId}`,

  // /api/v1/services – xidmət siyahısı
  services: (businessId: string) =>
    `/business/${businessId}/services`,

  // /api/v1/services/{id}
  serviceDetail: (businessId: string, serviceId: string) =>
    `/business/${businessId}/services/${serviceId}`,

  // /api/v1/staff – işçi siyahısı
  staff: (businessId: string) =>
    `/business/${businessId}/staff`,

  // /api/v1/staff/{id}
  staffDetail: (businessId: string, staffId: string) =>
    `/business/${businessId}/staff/${staffId}`,

  // /api/v1/staff/invites – token-based invite flow
  invites: (businessId: string) =>
    `/business/${businessId}/invites`,

  // /api/v1/customers – müştəri siyahısı
  customers: (businessId?: string) => `/business/${businessId}/customers`,

  // /api/v1/customers/{id}
  customerDetail: (businessId: string, customerId: string) =>
    `/business/${businessId}/customers/${customerId}`,

  // settings – profil tənzimləmələri
  settingsProfile: (businessId: string) =>
    `/business/${businessId}/settings/profile`,
} as const;
