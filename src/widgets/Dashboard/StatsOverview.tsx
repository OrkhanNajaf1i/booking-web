import { StatCard } from './StatCard'
import { CalendarIcon, WalletIcon, ClockIcon, XCircleIcon } from 'lucide-react';

export const StatsOverview = () => {
    return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Cəmi Rezervasiyalar"
        value="1,240"
        trend="12%"
        trendUp={true}
        color="blue"
        icon={<CalendarIcon className="h-6 w-6" />}
      />
      <StatCard
        title="Ümumi Gəlir"
        value="₼ 12,450"
        trend="8.2%"
        trendUp={true}
        color="green"
        icon={<WalletIcon className="h-6 w-6" />}
      />
      <StatCard
        title="Təsdiq Gözləyən"
        value="12"
        trend="5 yeni"
        trendUp={true} 
        color="yellow"
        icon={<ClockIcon className="h-6 w-6" />}
      />
      <StatCard
        title="Ləğv Olunanlar"
        value="3"
        trend="2%"
        trendUp={false} 
        color="red"
        icon={<XCircleIcon className="h-6 w-6" />}
      />
    </div>
}