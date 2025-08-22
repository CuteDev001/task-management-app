"use client"

import React, { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import type { Task, SubTask } from '../types/task'

interface SubTaskListProps {
  task: Task
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ task }) => {
  const [newSubTask, setNewSubTask] = useState('')
  const addSubtask = useTaskStore((state) => state.addSubtask)
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask)
  const deleteSubtask = useTaskStore((state) => state.deleteSubtask)
  const addSubtaskNote = useTaskStore((state) => state.addSubtaskNote)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubTask.trim()) return
    addSubtask(task.id!, newSubTask.trim())
    setNewSubTask('')
  }

  const handleToggleComplete = (subtaskId: string) => {
    toggleSubtask(task.id!, subtaskId)
  }

  const handleDeleteSubTask = (subtaskId: string) => {
    deleteSubtask(task.id!, subtaskId)
  }

  const handleAddNote = (subtaskId: string) => {
    const content = (noteDrafts[subtaskId] || '').trim()
    if (!content) return
    addSubtaskNote(task.id!, subtaskId, content)
    setNoteDrafts((prev) => ({ ...prev, [subtaskId]: '' }))
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
            className="rounded-md border border-gray-200 p-2 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between gap-2">
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
            </div>

            <div className="mt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddNote(subtask.id)
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={noteDrafts[subtask.id] || ''}
                  onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [subtask.id]: e.target.value }))}
                  placeholder="Add note to this subtask..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Add
                </button>
              </form>
              <ul className="mt-2 space-y-1">
                {(subtask.notes ?? []).map((n) => (
                  <li key={n.id} className="text-xs text-gray-700 bg-gray-50 rounded-md p-2 border">
                    <div className="whitespace-pre-wrap">{n.content}</div>
                  </li>) )}
                {(subtask.notes ?? []).length === 0 && (
                  <li className="text-xs text-gray-500">No notes yet.</li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
