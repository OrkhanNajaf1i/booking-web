import type { RouteObject } from 'react-router-dom';
import { Navigate,Outlet } from 'react-router-dom';
import { DashboardPage } from '../../pages/dashboard';
import { AuthGuard } from './guards/AuthGuard';
import { BusinessGuard } from './guards/BusinessGuard';
import { MainLayout } from '../layouts/MainLayout';
import { RootRedirect } from '../../pages/root-redirect';
import  OnboardingPage  from '../../pages/onboarding';
import CustomersPage from "../../pages/customers/index"
import RegisterPage from '@/pages/register';
import LoginPage from '@/pages/login';
import { GuestGuard } from './guards/GuestGuard';
import {paths} from '@/app/router/lib/paths';
import { OnboardingGuard } from './guards/OnboardingGuard';
import Settings from '@/pages/settings/index';
import BookingsPage from '@/pages/bookings';
import SchedulePage from '@/pages/schedule';
import StaffPage from '@/pages/staff';
import ServicesPage from '@/pages/services';
import LocationsPage from '@/pages/locations';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <RootRedirect />
    },
    {
        element: (<GuestGuard/>),
        children: [
            {
                path: `${paths.register()}`,
                element: (<RegisterPage/>)
            },
            {
                path: `${paths.login()}`,
                element:(<LoginPage/>)
            },      
        ]
    },
    {
        element: (<AuthGuard/>),
        children: [
             {
                element: (<OnboardingGuard />),
                children: [
                    {
                    path: paths.onboarding(),
                    element: <OnboardingPage />,
                    },
                    // gələcəkdə business create page varsa onu da bura sal
                ],
            },
            {
                path: 'business/:businessId',
                element: (<BusinessGuard />),
                children: [
                    {
                        element:(<MainLayout><Outlet/></MainLayout>),
                        children: [
                            {
                                index: true,
                                element: <Navigate to="dashboard" replace />
                            },
                            {
                                path: 'dashboard',
                                element: (<DashboardPage />)
                            },
                            {
                                path: 'bookings',
                                element: (<BookingsPage />)
                            },
                            {
                                // İş saatı, nahar fasiləsi və seçim addımı
                                path: "schedule",
                                element: (<SchedulePage />)
                            },
                            {
                                path: "services",
                                element: (<ServicesPage />)
                            },
                            {
                                path: "locations",
                                element: (<LocationsPage />)
                            },
                            {
                                path: "settings/profile",
                                element: (<Settings/>)
                            },
                              {
                                path: "staff",
                                element: (<StaffPage />)
                            },
                            {
                                // child routes must use relative paths, not absolute ones
                                // previously we used paths.customers("sadf323") which produced
                                // "/business/sadf323/customers" and React Router complained that
                                // an absolute path nested under "business/:businessId" is invalid.
                                // Instead just specify the segment directly and let the parent
                                // path's param supply the businessId.
                                path: 'customers',
                                element: (<CustomersPage/>)
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element:<div>Not Found</div>
    }
]