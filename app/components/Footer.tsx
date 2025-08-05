"use client"

import React from 'react'
import Link from 'next/link'
import { Home, Info, Wallet, Award, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'About', icon: Info, href: '/about' },
    { name: 'Wallet', icon: Wallet, href: '/wallet' },
    { name: 'Level', icon: Award, href: '/level' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]

  return (
    <footer className="bg-white sticky bottom-0 z-50 border-t border-gray-200">
      <nav className="container mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="text-center flex flex-col items-center p-2 group">
              <item.icon className={`h-6 w-6 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`} />
              <span className={`text-xs mt-1 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}

export default Footer 