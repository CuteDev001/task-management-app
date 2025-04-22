"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import { useTaskStore } from '../store/taskStore'
import { SubTaskList } from './SubTaskList'
import { Progress } from './ui/Progress'
import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask(task.id!, { status: e.target.value as Task['status'] })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id!)
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${
        isExpanded ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div 
          className="space-y-1 flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <button
              className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                isExpanded ? 'rotate-180' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              {format(new Date(task.startDate), 'MMM d')} -{' '}
              {format(new Date(task.endDate), 'MMM d, yyyy')}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-500">{task.progress}%</span>
            </div>
            <Progress value={task.progress} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="Todo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Subtasks</h4>
              <span className="text-sm text-gray-500">
                {task.subtasks.filter((st) => st.completed).length} of {task.subtasks.length} completed
              </span>
            </div>
            <SubTaskList task={task} />
          </div>
        </>
      )}
    </div>
  )
}
