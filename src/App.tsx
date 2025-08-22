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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function AppContent() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-emerald-600 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Task Master
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-600 hover:text-emerald-600"
              >
                Sign Out
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium">{user?.email?.[0].toUpperCase()}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center">
                          <span className="font-medium text-lg">{user?.email?.[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.email}</p>
                          <p className="text-sm text-gray-500">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Link
                          to="/profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Edit Profile
                        </Link>
                        <button
                          onClick={() => {
                            signOut()
                            setIsProfileOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <UserGreeting />
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
                <button
                  onClick={handleOpenForm}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                >
                  Add Task
                </button>
              </div>
            </div>
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

const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

export default App
