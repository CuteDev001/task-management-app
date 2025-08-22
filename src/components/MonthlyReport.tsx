"use client"

import React, { useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'
import { startOfMonth, endOfMonth, startOfWeek, addDays, isWithinInterval, format } from 'date-fns'

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
		<div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Report</h3>
			<div className="space-y-3">
				{weeks.map((w) => (
					<div key={w.label} className="border rounded-md p-3">
						<div className="flex justify-between text-sm text-gray-700 mb-1">
							<span className="font-medium">{w.label}</span>
							<span>{w.tasks} tasks • {w.avgProgress}%</span>
						</div>
						<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-emerald-500" style={{ width: `${w.avgProgress}%` }} />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}