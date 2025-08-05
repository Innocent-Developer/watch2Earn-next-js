"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Settings, LogOut, X } from 'lucide-react'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SideDrawer = ({ isOpen, onClose }: SideDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, onClose])

  return (
    <div
      className={`fixed inset-0 z-[100] transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div ref={drawerRef} className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-primary text-white p-6 rounded-xl">
            <div className="flex items-center mb-4">
              {/* Using a placeholder for user avatar */}
              <div className="h-12 w-12 rounded-full bg-light-purple flex items-center justify-center">
                <span className="text-primary font-bold">AB</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Abubakkar</h3>
                <p className="text-sm">abubakkarsajid4@gmail.com</p>
                <p className="text-xs">03254472055</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm opacity-75">Level</span>
              <p className="text-2xl font-bold">VIP0</p>
            </div>
          </div>

          <nav className="mt-8 space-y-4">
            <p className="text-gray-500 text-sm font-semibold mb-2">Menu</p>
            <Link href="/settings" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={onClose}>
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-gray-800">Settings</span>
            </Link>
            <Link href="/login" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={onClose}>
              <LogOut className="h-6 w-6 text-red-500" />
              <span className="text-red-500">Log out</span>
            </Link>
          </nav>
        </div>
      </div>
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
    </div>
  )
}

export default SideDrawer 