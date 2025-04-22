import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '../types/task'

interface TaskFilter {
  priority?: 'Low' | 'Medium' | 'High'
  status?: 'Todo' | 'In Progress' | 'Done'
  search?: string
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  addTask: (task: Task) => void
  updateTask: (taskId: string, task: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  filterTasks: (filter: TaskFilter) => Task[]
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      addTask: (task) => 
        set((state) => ({
          tasks: [...state.tasks, { 
            ...task, 
            id: crypto.randomUUID(),
            subtasks: [],
            progress: 0
          }],
          error: null
        })),
      updateTask: (taskId, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask, updatedAt: new Date() } : task
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      filterTasks: (filter) => {
        const state = get()
        return state.tasks.filter((task) => {
          const priorityMatch = !filter.priority || task.priority === filter.priority
          const statusMatch = !filter.status || task.status === filter.status
          const searchMatch = !filter.search || 
            task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
            task.description.toLowerCase().includes(filter.search.toLowerCase())
          return priorityMatch && statusMatch && searchMatch
        })
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'task-storage',
    }
  )
)
