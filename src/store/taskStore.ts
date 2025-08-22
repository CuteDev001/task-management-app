import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Note, SubTask } from '../types/task'

interface TaskFilter {
  priority?: 'Low' | 'Medium' | 'High'
  status?: 'Todo' | 'In Progress' | 'Done'
  search?: string
}

interface TaskHistoryEntry {
  id: string
  task: Task
  completedAt: Date
}

interface TaskState {
  tasks: Task[]
  completedHistory: TaskHistoryEntry[]
  loading: boolean
  error: string | null
  addTask: (task: Task) => void
  updateTask: (taskId: string, task: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  filterTasks: (filter: TaskFilter) => Task[]
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  // notes
  addTaskNote: (taskId: string, content: string) => void
  addSubtaskNote: (taskId: string, subtaskId: string, content: string) => void
  // subtasks helpers
  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void
  // progress + complete
  recomputeProgress: (taskId: string) => void
  markTaskDone: (taskId: string) => void
}

const createNote = (content: string): Note => ({
  id: crypto.randomUUID(),
  content,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      completedHistory: [],
      loading: false,
      error: null,
      addTask: (task) => 
        set((state) => ({
          tasks: [...state.tasks, { 
            ...task, 
            id: crypto.randomUUID(),
            subtasks: [],
            progress: 0,
            notes: task.notes ?? []
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

      addTaskNote: (taskId, content) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, notes: [...(task.notes ?? []), createNote(content)], updatedAt: new Date() }
            : task
        ),
      })),

      addSubtaskNote: (taskId, subtaskId, content) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task
          const subtasks = task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, notes: [...(st.notes ?? []), createNote(content)], updatedAt: new Date() } : st
          )
          return { ...task, subtasks, updatedAt: new Date() }
        })
      })),

      addSubtask: (taskId, title) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task
          const newSubtask: SubTask = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          const subtasks = [...task.subtasks, newSubtask]
          const progress = computeProgress(subtasks)
          return { ...task, subtasks, progress, updatedAt: new Date() }
        })
      })),

      toggleSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task
          const subtasks = task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed, updatedAt: new Date() } : st
          )
          const progress = computeProgress(subtasks)
          return { ...task, subtasks, progress, updatedAt: new Date() }
        })
      })),

      deleteSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task
          const subtasks = task.subtasks.filter((st) => st.id !== subtaskId)
          const progress = computeProgress(subtasks)
          return { ...task, subtasks, progress, updatedAt: new Date() }
        })
      })),

      recomputeProgress: (taskId) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, progress: computeProgress(task.subtasks), updatedAt: new Date() } : task
        )
      })),

      markTaskDone: (taskId) => set((state) => {
        const task = state.tasks.find((t) => t.id === taskId)
        if (!task) return { tasks: state.tasks }
        const updatedTasks = state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'Done', progress: 100, updatedAt: new Date() } : t
        )
        const historyEntry: TaskHistoryEntry = {
          id: crypto.randomUUID(),
          task: { ...task, status: 'Done', progress: 100 },
          completedAt: new Date(),
        }
        return { tasks: updatedTasks, completedHistory: [...state.completedHistory, historyEntry] }
      }),
    }),
    {
      name: 'task-storage',
    }
  )
)

function computeProgress(subtasks: SubTask[]): number {
  if (subtasks.length === 0) return 0
  const completed = subtasks.filter((s) => s.completed).length
  return Math.round((completed / subtasks.length) * 100)
}
