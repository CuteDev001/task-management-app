"use client"

import React, { useMemo, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { TaskCard } from './TaskCard'
import type { Task } from '../types/task'

export const TaskList: React.FC = () => {
  const [filter, setFilter] = useState<{
    priority?: 'Low' | 'Medium' | 'High'
    status?: 'Todo' | 'In Progress' | 'Done'
    search?: string
  }>({})
  const [sortBy, setSortBy] = useState<'priority' | 'due' | 'progress'>('due')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const tasks = useTaskStore((state) => state.tasks)
  const filteredTasks = useTaskStore((state) => state.filterTasks(filter))

  const sortedTasks = useMemo(() => {
    const arr = [...filteredTasks]
    const compare = (a: Task, b: Task) => {
      switch (sortBy) {
        case 'priority': {
          const order = { High: 3, Medium: 2, Low: 1 }
          return (order[a.priority] - order[b.priority]) * (sortDir === 'asc' ? 1 : -1)
        }
        case 'progress': {
          return ((a.progress ?? 0) - (b.progress ?? 0)) * (sortDir === 'asc' ? 1 : -1)
        }
        case 'due':
        default: {
          const aTime = new Date(a.endDate).getTime()
          const bTime = new Date(b.endDate).getTime()
          return (aTime - bTime) * (sortDir === 'asc' ? 1 : -1)
        }
      }
    }
    arr.sort(compare)
    return arr
  }, [filteredTasks, sortBy, sortDir])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
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

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filter.search || ''}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search..."
            className="rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
            <option value="progress">Progress</option>
          </select>
          <button
            className="px-2 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          >
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {sortedTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}
