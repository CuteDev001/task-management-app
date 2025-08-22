"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import { useTaskStore } from '../store/taskStore'
import { SubTaskList } from './SubTaskList'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { ChevronDown, ChevronUp, Check, Trash2, Plus, MessageSquare } from 'lucide-react'
import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const addTaskNote = useTaskStore((state) => state.addTaskNote)
  const markTaskDone = useTaskStore((state) => state.markTaskDone)

  const handleStatusChange = (value: string) => {
    updateTask(task.id!, { status: value as Task['status'] })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id!)
    }
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    addTaskNote(task.id!, noteContent.trim())
    setNoteContent('')
  }

  const getPriorityVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'secondary'
      case 'Low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isExpanded ? 'ring-2 ring-ring ring-opacity-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div 
            className="space-y-2 flex-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {task.description && (
              <p className="text-muted-foreground text-sm">{task.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {format(new Date(task.startDate), 'MMM d')} -{' '}
                {format(new Date(task.endDate), 'MMM d, yyyy')}
              </span>
              <Badge variant={getPriorityVariant(task.priority)}>
                {task.priority}
              </Badge>
            </div>
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => markTaskDone(task.id!)}
              className="text-muted-foreground hover:text-primary"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Subtasks
                </h4>
                <span className="text-sm text-muted-foreground">
                  {task.subtasks.filter((st) => st.completed).length} of {task.subtasks.length} completed
                </span>
              </div>
              <SubTaskList task={task} />
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes & Memos
              </h4>
              <form onSubmit={handleAddNote} className="flex gap-2 mb-3">
                <Input
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add a quick note..."
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              <div className="space-y-2">
                {(task.notes ?? []).map((n) => (
                  <div key={n.id} className="text-sm bg-muted rounded-md p-3 border">
                    <div className="whitespace-pre-wrap">{n.content}</div>
                  </div>
                ))}
                {(task.notes ?? []).length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No notes yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
