import { Metadata } from 'next'
import DashboardClient from './components/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | PrimeWatcher',
  description: 'PrimeWatcher   - Watch & Earn',
}

export default function HomePage() {
  return <DashboardClient />
}
