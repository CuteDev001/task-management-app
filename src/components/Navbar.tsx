"use client"

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  CheckSquare, 
  Plus, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  BarChart3,
  Calendar
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckSquare className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="font-bold text-xl hidden sm:inline-block">Task Master</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Right side items */}
        <div className="ml-auto flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Add Task Button */}
          <Button size="sm" className="hidden sm:flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Member since {new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t bg-background/95 backdrop-blur"
          >
            <div className="container py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start flex items-center gap-3"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
              <div className="pt-2">
                <Button className="w-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}