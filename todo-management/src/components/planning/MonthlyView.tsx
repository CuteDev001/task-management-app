'use client'

import { useState, useMemo } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/database'
import { Button } from '@/components/ui/Button'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  parseISO,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isWithinInterval
} from 'date-fns'

export default function MonthlyView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const { tasks } = useTasks()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  // Get calendar grid (including partial weeks)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Group tasks by day
  const tasksByDay = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {}
    
    calendarDays.forEach(day => {
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
  }, [tasks, calendarDays])

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleCreateTaskForDay = (date: string) => {
    setSelectedDate(date)
    setShowCreateModal(true)
  }

  // Calculate monthly statistics
  const monthlyTasks = tasks.filter(task => 
    isSameMonth(parseISO(task.start_date), currentMonth) ||
    (task.due_date && isSameMonth(parseISO(task.due_date), currentMonth))
  )
  
  const monthlyProgress = monthlyTasks.length > 0
    ? Math.round(monthlyTasks.reduce((sum, task) => sum + task.completion_percentage, 0) / monthlyTasks.length)
    : 0

  const completedTasks = monthlyTasks.filter(task => task.status === 'completed').length
  const inProgressTasks = monthlyTasks.filter(task => task.status === 'in_progress').length
  const highPriorityTasks = monthlyTasks.filter(task => task.priority === 'high').length

  // Group calendar days into weeks
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Monthly Progress: {monthlyProgress}%
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${monthlyProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{monthlyTasks.length}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Week day headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksByDay[dayKey] || []
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentMonth)
            
            return (
              <div 
                key={dayKey} 
                className={`bg-white p-2 min-h-[120px] ${
                  !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
                } ${isToday ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {isCurrentMonth && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCreateTaskForDay(dayKey)}
                      className="w-5 h-5 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id}
                      className={`text-xs p-1 rounded truncate ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      } ${task.status === 'completed' ? 'opacity-60 line-through' : ''}`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly Progress Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress Report</h3>
        
        <div className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Completion</span>
              <span>{monthlyProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${monthlyProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Priority Breakdown</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {monthlyTasks.filter(task => task.priority === 'high').length}
                </div>
                <div className="text-gray-600">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">
                  {monthlyTasks.filter(task => task.priority === 'medium').length}
                </div>
                <div className="text-gray-600">Medium Priority</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {monthlyTasks.filter(task => task.priority === 'low').length}
                </div>
                <div className="text-gray-600">Low Priority</div>
              </div>
            </div>
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