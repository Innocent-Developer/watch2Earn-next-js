"use client"

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname()
  
  // Pages where we don't want to show header and footer
  const authPages = ['/login', '/register', '/forgot-password']
  const isAuthPage = authPages.includes(pathname)

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={`flex-grow ${isAuthPage ? '' : 'container mx-auto p-4 md:p-6 lg:p-8'}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default LayoutWrapper 