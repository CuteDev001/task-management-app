'use client'

import { useState, useMemo } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/database'
import { Button } from '@/components/ui/Button'
import TaskCard from '@/components/tasks/TaskCard'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar
} from 'lucide-react'
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks, 
  subWeeks,
  parseISO,
  isSameDay,
  isWithinInterval
} from 'date-fns'

export default function WeeklyView() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const { tasks } = useTasks()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Group tasks by day
  const tasksByDay = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {}
    
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd')
      grouped[dayKey] = tasks.filter(task => {
        const taskStart = parseISO(task.start_date)
        const taskDue = task.due_date ? parseISO(task.due_date) : null
        
        // Include task if it starts on this day, is due on this day, or spans this day
        return isSameDay(taskStart, day) || 
               (taskDue && isSameDay(taskDue, day)) ||
               (taskDue && isWithinInterval(day, { start: taskStart, end: taskDue }))
      })
    })
    
    return grouped
  }, [tasks, weekDays])

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const handleCreateTaskForDay = (date: string) => {
    setSelectedDate(date)
    setShowCreateModal(true)
  }

  // Calculate weekly progress
  const weeklyTasks = Object.values(tasksByDay).flat()
  const weeklyProgress = weeklyTasks.length > 0
    ? Math.round(weeklyTasks.reduce((sum, task) => sum + task.completion_percentage, 0) / weeklyTasks.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Weekly Progress: {weeklyProgress}%
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${weeklyProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map(day => {
          const dayKey = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDay[dayKey] || []
          const isToday = isSameDay(day, new Date())
          
          return (
            <div key={dayKey} className={`bg-white rounded-lg shadow ${
              isToday ? 'ring-2 ring-indigo-500' : ''
            }`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${
                      isToday ? 'text-indigo-600' : 'text-gray-900'
                    }`}>
                      {format(day, 'EEE')}
                    </h3>
                    <p className={`text-sm ${
                      isToday ? 'text-indigo-600' : 'text-gray-600'
                    }`}>
                      {format(day, 'MMM d')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCreateTaskForDay(dayKey)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {dayTasks.length > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${dayTasks.reduce((sum, task) => sum + task.completion_percentage, 0) / dayTasks.length}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                {dayTasks.map(task => (
                  <div key={task.id} className="text-xs">
                    <TaskCard task={task} />
                  </div>
                ))}
                {dayTasks.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{weeklyTasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {weeklyTasks.filter(task => task.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {weeklyTasks.filter(task => task.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal 
          initialDate={selectedDate}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedDate('')
          }}
        />
      )}
    </div>
  )
}