import type { RouteObject } from 'react-router-dom';
import { Navigate,Outlet } from 'react-router-dom';
import { DashboardPage } from '../../pages/dashboard';
import { AuthGuard } from './guards/AuthGuard';
import { BusinessGuard } from './guards/BusinessGuard';
import { MainLayout } from '../layouts/MainLayout';
import { RootRedirect } from '../../pages/root-redirect';
import { OnboardingPage } from '../../pages/onboarding';
import RegisterPage from '@/pages/register';
import LoginPage from '@/pages/login';
import { GuestGuard } from './guards/GuestGuard';
import {paths} from '@/app/router/lib/paths';

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
        element: <AuthGuard/>,
        children: [
            {
                path:`${paths.onboarding}`,
                element: <OnboardingPage/>,
            }
        ]
    },
    {
        element: (<AuthGuard/>),
        children: [
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
                                element: (<div>Booking</div>)
                            },
                            {
                                path: "slots",
                                element: (<div>Slots</div>)
                            },
                            {
                                path: "services",
                                element: (<div>Services</div>)
                            },
                            {
                                path: "locations",
                                element: (<div>Locations</div>)
                            },
                            {
                                path: "settings",
                                element: (<div>Settings</div>)
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