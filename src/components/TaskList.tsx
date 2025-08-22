"use client"

import React, { useMemo, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { TaskCard } from './TaskCard'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import type { Task } from '../types/task'

export const TaskList: React.FC = () => {
  const [filter, setFilter] = useState<{
    priority?: 'Low' | 'Medium' | 'High'
    status?: 'Todo' | 'In Progress' | 'Done'
    search?: string
  }>({})
  const [sortBy, setSortBy] = useState<'priority' | 'due' | 'progress'>('due')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredTasks = useTaskStore((state) => state.filterTasks(filter))

  const sortedTasks = useMemo(() => {
    const arr = [...filteredTasks]
    const compare = (a: Task, b: Task) => {
      switch (sortBy) {
        case 'priority': {
          const order = { High: 3, Medium: 2, Low: 1 }
          return (order[a.priority] - order[b.priority]) * (sortDir === 'asc' ? 1 : -1)
        }
        case 'progress': {
          return ((a.progress ?? 0) - (b.progress ?? 0)) * (sortDir === 'asc' ? 1 : -1)
        }
        case 'due':
        default: {
          const aTime = new Date(a.endDate).getTime()
          const bTime = new Date(b.endDate).getTime()
          return (aTime - bTime) * (sortDir === 'asc' ? 1 : -1)
        }
      }
    }
    arr.sort(compare)
    return arr
  }, [filteredTasks, sortBy, sortDir])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex bg-muted p-1 rounded-lg">
                <Button
                  variant={!filter.status ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, status: undefined }))}
                >
                  All
                </Button>
                <Button
                  variant={filter.status === 'Todo' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, status: 'Todo' }))}
                >
                  To Do
                </Button>
                <Button
                  variant={filter.status === 'In Progress' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, status: 'In Progress' }))}
                >
                  In Progress
                </Button>
                <Button
                  variant={filter.status === 'Done' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, status: 'Done' }))}
                >
                  Done
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Priority:</span>
              <div className="flex bg-muted p-1 rounded-lg">
                <Button
                  variant={!filter.priority ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, priority: undefined }))}
                >
                  All
                </Button>
                <Button
                  variant={filter.priority === 'High' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, priority: 'High' }))}
                >
                  High
                </Button>
                <Button
                  variant={filter.priority === 'Medium' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, priority: 'Medium' }))}
                >
                  Medium
                </Button>
                <Button
                  variant={filter.priority === 'Low' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter((prev) => ({ ...prev, priority: 'Low' }))}
                >
                  Low
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={filter.search || ''}
                onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search tasks..."
                className="w-64"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due">Due date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortDir === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {sortedTasks.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground">
                  No tasks match the selected filters. Try adjusting your search criteria.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
