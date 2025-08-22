"use client"

import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TaskList } from "./components/TaskList"
import { TaskForm } from "./components/TaskForm"
import { WeatherWidget } from "./components/WeatherWidget"
import { TaskOverview } from "./components/TaskOverview"
import { UserGreeting } from "./components/UserGreeting"
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Profile } from './components/Profile'
import { DailyProgressView } from './components/DailyProgressView'
import { WeeklyPlanner } from './components/WeeklyPlanner'
import { MonthlyReport } from './components/MonthlyReport'
import { OngoingTasks } from './components/OngoingTasks'
import { Button } from './components/ui/button'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu'
import { Plus, User, Settings, LogOut, CheckSquare } from 'lucide-react'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function AppContent() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleOpenForm = () => {
    console.log('Opening form...')
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    console.log('Closing form...')
    setIsFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Task Master</span>
          </Link>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={handleOpenForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
            
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
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <UserGreeting />
            <TaskList />
          </div>
          <div className="space-y-6">
            <WeatherWidget />
            <TaskOverview />
            <DailyProgressView />
            <WeeklyPlanner />
            <MonthlyReport />
            <OngoingTasks />
          </div>
        </div>
      </main>

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppContent />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" />
    </AuthProvider>
  )
}

export default App
