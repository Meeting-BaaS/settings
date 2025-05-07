"use client"

import { SimpleSidebar } from "@/components/simple-sidebar"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutRootProps {
  children: React.ReactNode
}

const sidebarNavItems = [
  {
    title: "Email Preferences",
    href: "/email-preferences",
  },
  {
    title: "Delete Account",
    href: "/delete-account",
  }
]

export default function LayoutRoot({ children }: LayoutRootProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row min-h-screen max-w-container mx-auto w-full">
      {/* Mobile menu toggle */}
      <div className="lg:hidden p-4 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={16} />
          <span>Settings Menu</span>
        </Button>
      </div>
      
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 border-r p-6`}>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <SimpleSidebar items={sidebarNavItems} />
      </div>
      
      {/* Main content area - centered on desktop */}
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {children}
      </div>
    </div>
  )
} 