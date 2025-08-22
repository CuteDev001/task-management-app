"use client"

import React, { useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'
import { format, startOfWeek, addDays, isWithinInterval } from 'date-fns'

export const WeeklyPlanner: React.FC = () => {
	const tasks = useTaskStore((s) => s.tasks)
	const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
	const days = [...Array(7)].map((_, i) => addDays(weekStart, i))

	const tasksByDay = useMemo(() => {
		return days.map((day) => {
			const startDay = new Date(day.getFullYear(), day.getMonth(), day.getDate())
			const endDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999)
			const dayTasks = tasks.filter((t) => isWithinInterval(new Date(day), { start: new Date(t.startDate), end: new Date(t.endDate) }))
			const avgProgress = dayTasks.length ? Math.round(dayTasks.reduce((a, t) => a + (t.progress ?? 0), 0) / dayTasks.length) : 0
			return { day, tasks: dayTasks, avgProgress }
		})
	}, [tasks, JSON.stringify(days)])

	return (
		<div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">This Week</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{tasksByDay.map(({ day, tasks: dayTasks, avgProgress }) => (
					<div key={day.toISOString()} className="rounded-md border p-3">
						<div className="flex justify-between text-sm text-gray-700 mb-1">
							<span className="font-medium">{format(day, 'EEE, MMM d')}</span>
							<span>{dayTasks.length} tasks</span>
						</div>
						<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-emerald-500" style={{ width: `${avgProgress}%` }} />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}