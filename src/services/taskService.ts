import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Task } from '../types'

export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('taskService: Creating task for user:', userId)
    const task = {
      ...taskData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('taskService: Prepared task data:', task)
    const tasksCollection = collection(db, 'tasks')
    console.log('taskService: Got tasks collection reference')
    
    const docRef = await addDoc(tasksCollection, task)
    console.log('taskService: Document created with ID:', docRef.id)
    
    const createdTask = { ...task, id: docRef.id } as Task
    console.log('taskService: Returning created task:', createdTask)
    return createdTask
  } catch (error) {
    console.error('taskService: Detailed error in createTask:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to create task: ${error.message}`)
    }
    throw new Error('Failed to create task: Unknown error occurred')
  }
}

export const getTasks = async (userId: string) => {
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[]
  } catch (error) {
    console.error('Error getting tasks:', error)
    throw error
  }
}

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = doc(db, 'tasks', taskId)
    await deleteDoc(taskRef)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
} 