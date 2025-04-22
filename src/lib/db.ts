import Dexie, { type Table } from 'dexie'

export interface Task {
  id?: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  priority: 'Low' | 'Medium' | 'High'
  status: 'Todo' | 'In Progress' | 'Done'
  tags?: string[]
  notes?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  syncStatus: 'pending' | 'synced' | 'failed'
}

export class MyAppDatabase extends Dexie {
  tasks!: Table<Task>

  constructor() {
    super('MyAppDatabase')
    this.version(1).stores({
      tasks: '++id, userId, status, syncStatus, createdAt'
    })
  }
}

export const db = new MyAppDatabase()

// Initialize database
db.open().catch(err => {
  console.error('Failed to open database:', err)
})

// Helper functions for task operations
export async function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<Task> {
  try {
    console.log('Creating task with data:', taskData)
    const now = new Date()
    const task: Task = {
      ...taskData,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending'
    }

    console.log('Adding task to database:', task)
    const id = await db.tasks.add(task)
    console.log('Task added with ID:', id)
    
    const createdTask = { ...task, id: id.toString() }

    // Try to sync immediately if online
    if (navigator.onLine) {
      try {
        // Attempt to sync with Firebase (we'll implement this later)
        // await syncTaskToFirebase(createdTask)
        await db.tasks.update(id, { syncStatus: 'synced' })
        console.log('Task marked as synced')
      } catch (error) {
        console.error('Failed to sync task:', error)
        // Task will remain in 'pending' status and will be synced later
      }
    }

    return createdTask
  } catch (error) {
    console.error('Error in createTask:', error)
    throw error
  }
}

export async function getTasks(userId: string): Promise<Task[]> {
  try {
    console.log('Fetching tasks for user:', userId)
    const tasks = await db.tasks
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('createdAt')
    console.log('Found tasks:', tasks)
    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

// Background sync function
let isSyncing = false
export async function syncPendingTasks() {
  if (!navigator.onLine || isSyncing) return

  isSyncing = true
  try {
    console.log('Starting sync of pending tasks')
    const pendingTasks = await db.tasks
      .where('syncStatus')
      .equals('pending')
      .toArray()

    console.log('Found pending tasks:', pendingTasks)
    for (const task of pendingTasks) {
      try {
        // We'll implement this function later
        // await syncTaskToFirebase(task)
        await db.tasks.update(task.id!, { syncStatus: 'synced' })
        console.log('Task synced:', task.id)
      } catch (error) {
        console.error('Failed to sync task:', task.id, error)
        await db.tasks.update(task.id!, { syncStatus: 'failed' })
      }
    }
  } catch (error) {
    console.error('Error in syncPendingTasks:', error)
  } finally {
    isSyncing = false
  }
} 