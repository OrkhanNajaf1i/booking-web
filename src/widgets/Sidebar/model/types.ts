import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: (businessId: string) => string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
