"use client"

import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
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
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

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

  const handleCloseForm = () => {
    console.log('Closing form...')
    setIsFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
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

      <Footer />

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

export default App
