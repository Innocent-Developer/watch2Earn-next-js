import { Metadata } from 'next'
import DashboardPage from './page'

export const metadata: Metadata = {
  title: 'Dashboard | Watch2earn',
  description: 'Watch2earnDashboard - Watch & Earn',
}

export default function HomeLayout() {
  return <DashboardPage />
} 