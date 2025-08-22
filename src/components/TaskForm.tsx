"use client"

import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTaskStore } from '../store/taskStore'
import type { Task } from '../types/task'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Modal } from './ui/modal'
import { Calendar, Clock, Target, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
}

const initialFormState = {
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  priority: 'Low' as const,
  status: 'Todo' as const
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const addTask = useTaskStore((state) => state.addTask)
  const setLoading = useTaskStore((state) => state.setLoading)
  const setError = useTaskStore((state) => state.setError)
  
  const [formData, setFormData] = useState(initialFormState)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to create tasks')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const now = new Date()
      const task: Task = {
        ...formData,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
        subtasks: [],
        progress: 0
      }

      addTask(task)
      setFormData(initialFormState) // Reset form
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
      setError(error instanceof Error ? error.message : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    if (name === 'startDate' || name === 'endDate') {
      setFormData(prev => ({
        ...prev,
        [name]: new Date(value)
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClose = () => {
    setFormData(initialFormState) // Reset form when closing
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Task"
      description="Add a new task to your workspace"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Task Title
          </label>
          <Input
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            className="text-lg"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your task..."
            rows={3}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date
            </label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate.toISOString().split('T')[0]}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Due Date
            </label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate.toISOString().split('T')[0]}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Priority
            </label>
            <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Status
            </label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </motion.div>
        </div>
      </form>
    </Modal>
  )
}
