'use client'

import { useState, useMemo } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types/database'
import TaskCard from '@/components/tasks/TaskCard'
import { 
  Calendar,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react'
import { 
  format, 
  parseISO, 
  startOfMonth,
  subMonths
} from 'date-fns'

export default function HistoryView() {
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | '3months' | '6months'>('month')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const { tasks } = useTasks()

  // Filter tasks based on completion and time range
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => task.status === 'completed')

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (timeFilter) {
        case 'month':
          startDate = startOfMonth(now)
          break
        case '3months':
          startDate = subMonths(now, 3)
          break
        case '6months':
          startDate = subMonths(now, 6)
          break
        default:
          startDate = new Date(0) // Beginning of time
      }
      
      filtered = filtered.filter(task => {
        const taskUpdated = parseISO(task.updated_at)
        return taskUpdated >= startDate
      })
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    return filtered.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [tasks, timeFilter, priorityFilter])

  // Group tasks by month for timeline view
  const tasksByMonth = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {}
    
    filteredTasks.forEach(task => {
      const monthKey = format(parseISO(task.updated_at), 'yyyy-MM')
      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(task)
    })
    
    return grouped
  }, [filteredTasks])

  // Calculate statistics
  const totalCompleted = filteredTasks.length
  const avgCompletionTime = useMemo(() => {
    if (filteredTasks.length === 0) return 0
    
    const totalDays = filteredTasks.reduce((sum, task) => {
      const start = parseISO(task.start_date)
      const end = parseISO(task.updated_at)
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }, 0)
    
    return Math.round(totalDays / filteredTasks.length)
  }, [filteredTasks])

  const priorityStats = useMemo(() => {
    const stats = { high: 0, medium: 0, low: 0 }
    filteredTasks.forEach(task => {
      stats[task.priority]++
    })
    return stats
  }, [filteredTasks])

  return (
    <div className="space-y-6">
      {/* Filters and Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value as 'all' | 'month' | '3months' | '6months')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="all">All Time</option>
            </select>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{totalCompleted}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{avgCompletionTime}</div>
              <div className="text-xs text-gray-600">Avg Days</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{priorityStats.high}</div>
              <div className="text-xs text-gray-600">High Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion by Priority</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">High Priority</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${totalCompleted > 0 ? (priorityStats.high / totalCompleted) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{priorityStats.high}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Medium Priority</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${totalCompleted > 0 ? (priorityStats.medium / totalCompleted) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{priorityStats.medium}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Low Priority</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${totalCompleted > 0 ? (priorityStats.low / totalCompleted) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{priorityStats.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {Object.keys(tasksByMonth).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(tasksByMonth)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([monthKey, monthTasks]) => (
              <div key={monthKey} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {format(new Date(monthKey + '-01'), 'MMMM yyyy')}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                      {monthTasks.length} completed
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {monthTasks.map(task => (
                    <div key={task.id} className="border-l-4 border-green-500 pl-4">
                      <TaskCard task={task} />
                      <div className="mt-2 text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Completed on {format(parseISO(task.updated_at), 'PPP')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Tasks</h3>
          <p className="text-gray-600">
            Complete some tasks to see your progress history here.
          </p>
        </div>
      )}
    </div>
  )
}