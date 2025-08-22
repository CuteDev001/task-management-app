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
import { ChevronDown, Check, Trash2, Plus, MessageSquare, Calendar, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Done':
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400'
      case 'In Progress':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400'
      case 'Todo':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const isOverdue = new Date(task.endDate) < new Date() && task.status !== 'Done'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card 
        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${
          isOverdue ? 'border-red-200 dark:border-red-800' : ''
        } ${isExpanded ? 'ring-2 ring-ring ring-opacity-50' : ''}`}
      >
        {/* Priority indicator */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
          task.priority === 'High' ? 'bg-red-500' :
          task.priority === 'Medium' ? 'bg-yellow-500' :
          'bg-green-500'
        }`} />

        <CardHeader className="pb-3 pl-6">
          <div className="flex items-start justify-between">
            <div 
              className="space-y-3 flex-1 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Meta information */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(task.startDate), 'MMM d')} -{' '}
                    {format(new Date(task.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive" className="animate-pulse">
                    Overdue
                  </Badge>
                )}
              </div>

              {/* Progress section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className={`w-32 ${getStatusColor(task.status)}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => markTaskDone(task.id!)}
                  className="text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="pt-0 pl-6">
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
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm bg-muted rounded-md p-3 border"
                        >
                          <div className="whitespace-pre-wrap">{n.content}</div>
                        </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
