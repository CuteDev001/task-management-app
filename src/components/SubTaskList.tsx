"use client"

import React, { useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Plus, X } from 'lucide-react'
import type { Task } from '../types/task'

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
    <div className="space-y-4">
      <form onSubmit={handleAddSubTask} className="flex gap-2">
        <Input
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Add a subtask..."
          className="flex-1"
        />
        <Button type="submit" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        {task.subtasks.map((subtask) => (
          <Card key={subtask.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => handleToggleComplete(subtask.id)}
                />
                <span className={subtask.completed ? "line-through text-muted-foreground" : "font-medium"}>
                  {subtask.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSubTask(subtask.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddNote(subtask.id)
                }}
                className="flex gap-2"
              >
                <Input
                  value={noteDrafts[subtask.id] || ''}
                  onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [subtask.id]: e.target.value }))}
                  placeholder="Add note to this subtask..."
                  className="flex-1 text-sm"
                />
                <Button type="submit" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </form>
              <div className="mt-2 space-y-1">
                {(subtask.notes ?? []).map((n) => (
                  <div key={n.id} className="text-xs bg-muted/50 rounded-md p-2 border">
                    <div className="whitespace-pre-wrap">{n.content}</div>
                  </div>
                ))}
                {(subtask.notes ?? []).length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    No notes yet.
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        {task.subtasks.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No subtasks yet. Add one to get started!
          </div>
        )}
      </div>
    </div>
  )
}
