'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/Button'
import TaskCard from '@/components/tasks/TaskCard'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'
import WeeklyView from '@/components/planning/WeeklyView'
import MonthlyView from '@/components/planning/MonthlyView'
import HistoryView from '@/components/history/HistoryView'
import { 
  Calendar, 
  CalendarDays, 
  History, 
  Plus, 
  LogOut,
  Filter,
  BarChart3
} from 'lucide-react'
import { isToday, parseISO } from 'date-fns'

type ViewType = 'dashboard' | 'weekly' | 'monthly' | 'history'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { tasks, loading } = useTasks()
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority
    const statusMatch = filterStatus === 'all' || task.status === filterStatus
    return priorityMatch && statusMatch
  })

  // Get today's tasks
  const todaysTasks = filteredTasks.filter(task => 
    isToday(parseISO(task.start_date)) || 
    (task.due_date && isToday(parseISO(task.due_date)))
  )

  // Calculate today's progress
  const todaysProgress = todaysTasks.length > 0 
    ? Math.round(todaysTasks.reduce((sum, task) => sum + task.completion_percentage, 0) / todaysTasks.length)
    : 0

  // Get ongoing tasks (in progress or started but not completed)
  const ongoingTasks = filteredTasks.filter(task => 
    task.status === 'in_progress' || 
    (task.status === 'pending' && task.completion_percentage > 0)
  )

  const renderContent = () => {
    switch (currentView) {
      case 'weekly':
        return <WeeklyView />
      case 'monthly':
        return <MonthlyView />
      case 'history':
        return <HistoryView />
      default:
        return (
          <div className="space-y-6">
            {/* Today's Progress Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Today&apos;s Progress
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${todaysProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{todaysProgress}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {todaysTasks.length} tasks scheduled for today
              </p>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Today's Tasks */}
            {todaysTasks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Today&apos;s Tasks</h2>
                <div className="space-y-4">
                  {todaysTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Ongoing Tasks */}
            {ongoingTasks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Tasks</h2>
                <div className="space-y-4">
                  {ongoingTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* All Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Tasks</h2>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No tasks found. Create your first task to get started!</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('weekly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                currentView === 'weekly'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Weekly
            </button>
            <button
              onClick={() => setCurrentView('monthly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                currentView === 'monthly'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              Monthly
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                currentView === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="w-4 h-4 mr-1" />
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal 
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}