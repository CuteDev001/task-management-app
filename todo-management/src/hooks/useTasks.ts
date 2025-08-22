'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Task, Subtask, TaskNote } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchTasks = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (!user) return

    fetchTasks()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, supabase, fetchTasks])

  const createTask = async (taskData: {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    priority_weight?: number
    start_date: string
    due_date?: string
  }) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  }
}

export function useSubtasks(taskId: string) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchSubtasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setSubtasks(data || [])
    } catch (error) {
      console.error('Error fetching subtasks:', error)
    } finally {
      setLoading(false)
    }
  }, [taskId, supabase])

  useEffect(() => {
    if (!taskId) return

    fetchSubtasks()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('subtasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'subtasks',
        filter: `task_id=eq.${taskId}`
      }, () => {
        fetchSubtasks()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [taskId, supabase, fetchSubtasks])

  const createSubtask = async (subtaskData: {
    title: string
    description?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert({
          ...subtaskData,
          task_id: taskId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating subtask:', error)
      throw error
    }
  }

  const updateSubtask = async (id: string, updates: Partial<Subtask>) => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating subtask:', error)
      throw error
    }
  }

  const deleteSubtask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting subtask:', error)
      throw error
    }
  }

  return {
    subtasks,
    loading,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    refetch: fetchSubtasks,
  }
}

export function useTaskNotes(taskId: string) {
  const [notes, setNotes] = useState<TaskNote[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('task_notes')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }, [taskId, supabase])

  useEffect(() => {
    if (!taskId) return

    fetchNotes()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('task_notes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'task_notes',
        filter: `task_id=eq.${taskId}`
      }, () => {
        fetchNotes()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [taskId, supabase, fetchNotes])

  const createNote = async (content: string) => {
    try {
      const { data, error } = await supabase
        .from('task_notes')
        .insert({
          content,
          task_id: taskId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    }
  }

  const updateNote = async (id: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('task_notes')
        .update({ content })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('task_notes')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  }

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  }
}