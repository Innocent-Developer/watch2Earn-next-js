"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, Menu, X, User } from 'lucide-react'
import SideDrawer from './SideDrawer'

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <header className="bg-primary text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side with menu and notifications */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsDrawerOpen(true)} className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              1
            </span>
          </div>
        </div>

        {/* Center with logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center">
            {/* Using a placeholder image for the logo */}
            <div className="h-10 w-10 relative">
              <Image 
                src="https://res.cloudinary.com/dha65z0gy/image/upload/v1754294658/qgi0crp5afdl5acfmqty.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="rounded-full"
              />
            </div>
            <h1 className="ml-2 text-xl font-bold tracking-wider hidden sm:block">Watch2earn</h1>
          </div>
        </Link>
        
        {/* Right side with user and notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 hidden md:block" />
            <span className="absolute top-0 right-0 hidden md:inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              1
            </span>
          </div>
          <button onClick={() => setIsDrawerOpen(true)} className="hidden md:block">
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  )
}

export default Header