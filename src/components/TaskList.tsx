"use client"

import React, { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { TaskCard } from './TaskCard'
import type { Task } from '../types/task'

export const TaskList: React.FC = () => {
  const [filter, setFilter] = useState<{
    priority?: 'Low' | 'Medium' | 'High'
    status?: 'Todo' | 'In Progress' | 'Done'
    search?: string
  }>({})

  const tasks = useTaskStore((state) => state.tasks)
  const filteredTasks = useTaskStore((state) => state.filterTasks(filter))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                !filter.status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, status: undefined }))}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter.status === 'Todo'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, status: 'Todo' }))}
            >
              To Do
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter.status === 'In Progress'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, status: 'In Progress' }))}
            >
              In Progress
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter.status === 'Done'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, status: 'Done' }))}
            >
              Done
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Priority:</span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                !filter.priority
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, priority: undefined }))}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter.priority === 'High'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, priority: 'High' }))}
            >
              High
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter.priority === 'Medium'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, priority: 'Medium' }))}
            >
              Medium
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter.priority === 'Low'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter((prev) => ({ ...prev, priority: 'Low' }))}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}
