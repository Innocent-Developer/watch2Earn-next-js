import { Metadata } from 'next'
import DashboardClient from './components/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | Watch2earn',
  description: 'Watch2earn - Watch & Earn',
}

export default function HomePage() {
  return <DashboardClient />
}
