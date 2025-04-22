export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: TaskStatus
  startDate: Date
  endDate: Date
  dueDate?: Date
  tags: string[]
  notes?: string
  completed: boolean
  subtasks: any[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export interface TaskFilter {
  priority?: Priority
  status?: TaskStatus
  search?: string
  tags?: string[]
  startDate?: Date
  endDate?: Date
  completed?: boolean
}
