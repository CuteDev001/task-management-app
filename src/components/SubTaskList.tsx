"use client"

import React, { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import type { Task, SubTask } from '../types/task'

interface SubTaskListProps {
  task: Task
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ task }) => {
  const [newSubTask, setNewSubTask] = useState('')
  const updateTask = useTaskStore((state) => state.updateTask)

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubTask.trim()) return

    const now = new Date()
    const newSubTaskItem: SubTask = {
      id: crypto.randomUUID(),
      title: newSubTask.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    }

    const updatedSubtasks = [...task.subtasks, newSubTaskItem]
    const progress = calculateProgress(updatedSubtasks)

    updateTask(task.id!, {
      subtasks: updatedSubtasks,
      progress,
    })

    setNewSubTask('')
  }

  const handleToggleComplete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed, updatedAt: new Date() }
        : subtask
    )
    const progress = calculateProgress(updatedSubtasks)

    updateTask(task.id!, {
      subtasks: updatedSubtasks,
      progress,
    })
  }

  const handleDeleteSubTask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId)
    const progress = calculateProgress(updatedSubtasks)

    updateTask(task.id!, {
      subtasks: updatedSubtasks,
      progress,
    })
  }

  const calculateProgress = (subtasks: SubTask[]): number => {
    if (subtasks.length === 0) return 0
    const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length
    return Math.round((completedSubtasks / subtasks.length) * 100)
  }

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleAddSubTask} className="flex gap-2">
        <input
          type="text"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Add a subtask..."
          className="flex-1 rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {task.subtasks.map((subtask) => (
          <li
            key={subtask.id}
            className="flex items-center justify-between gap-2 rounded-md border border-gray-200 p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleComplete(subtask.id)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className={subtask.completed ? "line-through text-gray-500" : ""}>
                {subtask.title}
              </span>
            </div>
            <button
              onClick={() => handleDeleteSubTask(subtask.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
