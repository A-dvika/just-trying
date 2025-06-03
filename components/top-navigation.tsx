"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, Settings } from "lucide-react"

const navigationItems = [
  { name: "Schedule Migration", href: "#", active: true },
  { name: "Migration Status", href: "#", active: false },
  { name: "Scheduled Migrations", href: "#", active: false },
]

export function TopNavigation() {
  const [activeItem, setActiveItem] = useState("Schedule Migration")

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Migration Hub</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  variant={activeItem === item.name ? "default" : "ghost"}
                  className={`${
                    activeItem === item.name
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Right side - User profile and settings */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
