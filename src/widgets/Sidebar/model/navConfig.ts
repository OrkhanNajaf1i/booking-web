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
    title: 'Əməliyyatlar',
    items: [
      {
        label: 'İdarə paneli',
        icon: LayoutDashboard,
        path: (id) => paths.dashboard(id),
      },
      {
        label: 'Randevular',
        icon: CalendarDays,
        path: (id) => paths.bookings(id),
      },
      {
        label: 'İş qrafiki',
        icon: Clock3,
        path: (id) => `/business/${id}/schedule`,
      },
    ],
  },
  {
    title: 'Müştərilər',
    items: [
      {
        label: 'Müştərilər',
        icon: Users,
        path: (id) => paths.customers(id),
      },
    ],
  },
  {
    title: 'Komanda',
    items: [
      {
        label: 'İşçilər',
        icon: UserCheck,
        path: (id) => paths.staff(id),
      },
    ],
  },
  {
    title: 'Kataloq',
    items: [
      {
        label: 'Xidmətlər',
        icon: Scissors,
        path: (id) => paths.services(id),
      },
      {
        label: 'Filiallar',
        icon: MapPin,
        path: (id) => paths.locations(id),
      },
    ],
  },
  {
    title: 'Ayarlar',
    items: [
      {
        label: 'Ayarlar',
        icon: Settings,
        path: (id) => paths.settingsProfile(id),
      },
    ],
  },
];
