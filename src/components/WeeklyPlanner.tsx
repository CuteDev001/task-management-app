"use client"

import React, { useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'
import { format, startOfWeek, addDays, isWithinInterval } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Calendar, TrendingUp } from 'lucide-react'

export const WeeklyPlanner: React.FC = () => {
	const tasks = useTaskStore((s) => s.tasks)
	const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
	const days = [...Array(7)].map((_, i) => addDays(weekStart, i))

	const tasksByDay = useMemo(() => {
		return days.map((day) => {
			const dayTasks = tasks.filter((t) => isWithinInterval(new Date(day), { start: new Date(t.startDate), end: new Date(t.endDate) }))
			const avgProgress = dayTasks.length ? Math.round(dayTasks.reduce((a, t) => a + (t.progress ?? 0), 0) / dayTasks.length) : 0
			return { day, tasks: dayTasks, avgProgress }
		})
	}, [tasks, JSON.stringify(days)])

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5 text-primary" />
					This Week
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{tasksByDay.map(({ day, tasks: dayTasks, avgProgress }) => (
						<div key={day.toISOString()} className="space-y-2 p-3 rounded-lg border bg-muted/30">
							<div className="flex justify-between items-center">
								<span className="font-medium text-sm">{format(day, 'EEE, MMM d')}</span>
								<div className="flex items-center gap-1">
									<TrendingUp className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">{dayTasks.length} tasks</span>
								</div>
							</div>
							<Progress value={avgProgress} className="h-2" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}