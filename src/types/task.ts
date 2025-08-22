import { Priority, TaskStatus } from "./index"

export interface Note {
	id: string
	content: string
	createdAt: Date
	updatedAt: Date
}

export interface SubTask {
	id: string
	title: string
	completed: boolean
	createdAt: Date
	updatedAt: Date
	notes?: Note[]
}

export interface Task {
	id?: string
	title: string
	description: string
	startDate: Date
	endDate: Date
	priority: 'Low' | 'Medium' | 'High'
	status: 'Todo' | 'In Progress' | 'Done'
	userId: string
	createdAt: Date
	updatedAt: Date
	subtasks: SubTask[]
	progress: number
	notes?: Note[]
	priorityWeight?: number
}

export interface TaskFilter {
	priority?: Priority
	tags?: string[]
	completed?: boolean
	startDate?: Date
	endDate?: Date
}

export interface DailyProgress {
	date: Date
	completedTasks: number
	totalTasks: number
	progress: number
}

export { Priority, TaskStatus }
