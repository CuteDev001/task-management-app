"use client"

import React, { useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'
import { startOfMonth, endOfMonth, startOfWeek, addDays, isWithinInterval, format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Calendar, BarChart3 } from 'lucide-react'

export const MonthlyReport: React.FC = () => {
	const tasks = useTaskStore((s) => s.tasks)
	const today = new Date()
	const mStart = startOfMonth(today)
	const mEnd = endOfMonth(today)

	const weeks = useMemo(() => {
		const firstWeekStart = startOfWeek(mStart, { weekStartsOn: 1 })
		const result: { label: string; tasks: number; avgProgress: number }[] = []
		let cursor = firstWeekStart
		while (cursor <= mEnd) {
			const weekDays = [...Array(7)].map((_, i) => addDays(cursor, i))
			const weekTasks = tasks.filter((t) =>
				weekDays.some((d) => isWithinInterval(d, { start: new Date(t.startDate), end: new Date(t.endDate) }))
			)
			const avg = weekTasks.length ? Math.round(weekTasks.reduce((a, t) => a + (t.progress ?? 0), 0) / weekTasks.length) : 0
			result.push({ label: `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d')}`, tasks: weekTasks.length, avgProgress: avg })
			cursor = addDays(cursor, 7)
		}
		return result
	}, [tasks, mStart.getTime(), mEnd.getTime()])

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BarChart3 className="h-5 w-5 text-primary" />
					Monthly Report
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{weeks.map((w) => (
						<div key={w.label} className="space-y-2 p-3 rounded-lg border bg-muted/30">
							<div className="flex justify-between items-center">
								<span className="font-medium text-sm">{w.label}</span>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Calendar className="h-3 w-3" />
									<span>{w.tasks} tasks • {w.avgProgress}%</span>
								</div>
							</div>
							<Progress value={w.avgProgress} className="h-2" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}