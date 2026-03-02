import {
  LayoutDashboard,
  CalendarDays,
  Clock3,
  Users,
  UserCheck,
  Scissors,
  MapPin,
  Settings,
} from 'lucide-react';
import { paths } from '@/app/router/lib/paths';
import type { NavGroup } from './types';

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Operations',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: (id) => paths.dashboard(id),
      },
      {
        label: 'Bookings',
        icon: CalendarDays,
        path: (id) => paths.bookings(id),
      },
      {
        label: 'Slots',
        icon: Clock3,
        path: (id) => `/business/${id}/slots`,
      },
    ],
  },
  {
    title: 'Customers',
    items: [
      {
        label: 'Customers',
        icon: Users,
        path: (id) => paths.customers(id),
      },
    ],
  },
  {
    title: 'Team',
    items: [
      {
        label: 'Staff',
        icon: UserCheck,
        path: (id) => paths.staff(id),
      },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        label: 'Services',
        icon: Scissors,
        path: (id) => paths.services(id),
      },
      {
        label: 'Locations',
        icon: MapPin,
        path: (id) => paths.locations(id),
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        label: 'Settings',
        icon: Settings,
        path: (id) => paths.settingsProfile(id),
      },
    ],
  },
];
