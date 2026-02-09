
export const paths = {
    dashboard: (businessId: string) => `/business/${businessId}/dashboard`,
    bookings: (businessId: string) => `/business/${businessId}/bookings`,
    register: () => `/register`,
    login: () => `/login`,
    onboarding: () => `/onboarding`,
    forgotPassword: '/forgot-password',
    // bookings: (businessId: string) => `/business/${businessId}/bookings`,
    notFound:'/not-found'
}