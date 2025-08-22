'use client'

import { useState } from 'react'
import { Task } from '@/types/database'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/Button'
import TaskDetailModal from './TaskDetailModal'
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Circle,
  AlertTriangle,
  Flag
} from 'lucide-react'
import { format, parseISO, isToday, isPast } from 'date-fns'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { updateTask, deleteTask } = useTasks()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in_progress': return 'text-blue-600'
      case 'pending': return 'text-gray-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleStatusToggle = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    const newCompletion = newStatus === 'completed' ? 100 : task.completion_percentage
    
    try {
      await updateTask(task.id, { 
        status: newStatus,
        completion_percentage: newCompletion
      })
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && task.status !== 'completed'
  const isDueToday = task.due_date && isToday(parseISO(task.due_date))

  return (
    <>
      <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
        isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={handleStatusToggle}
                className={`flex-shrink-0 ${getStatusColor(task.status)}`}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <h3 
                className={`text-lg font-medium truncate cursor-pointer hover:text-indigo-600 ${
                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
                onClick={() => setShowDetailModal(true)}
              >
                {task.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                <Flag className="w-3 h-3 mr-1" />
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{task.completion_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.completion_percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Dates and Status */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(parseISO(task.start_date), 'MMM d')}
              </div>
              {task.due_date && (
                <div className={`flex items-center ${
                  isOverdue ? 'text-red-600' : isDueToday ? 'text-yellow-600' : ''
                }`}>
                  <Clock className="w-4 h-4 mr-1" />
                  Due {format(parseISO(task.due_date), 'MMM d')}
                  {isOverdue && <AlertTriangle className="w-4 h-4 ml-1" />}
                </div>
              )}
              <span className={`capitalize ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetailModal(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {showDetailModal && (
        <TaskDetailModal 
          task={task}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}