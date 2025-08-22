"use client"

import React from 'react'
import { useTaskStore } from '../store/taskStore'

function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export const DailyProgressView: React.FC = () => {
	const tasks = useTaskStore((s) => s.tasks)
	const today = new Date()
	const todaysTasks = tasks.filter((t) => {
		const start = new Date(t.startDate)
		const end = new Date(t.endDate)
		const d0 = new Date(start.getFullYear(), start.getMonth(), start.getDate())
		const d1 = new Date(end.getFullYear(), end.getMonth(), end.getDate())
		const dT = new Date(today.getFullYear(), today.getMonth(), today.getDate())
		return dT >= d0 && dT <= d1
	})
	const avgProgress = todaysTasks.length > 0 ? Math.round(todaysTasks.reduce((a, t) => a + (t.progress ?? 0), 0) / todaysTasks.length) : 0

	return (
		<div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
			<h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Progress</h3>
			<div className="flex justify-between text-sm mb-2 text-gray-600">
				<span>{todaysTasks.length} tasks</span>
				<span>{avgProgress}%</span>
			</div>
			<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
				<div className="h-full bg-emerald-500" style={{ width: `${avgProgress}%` }} />
			</div>
		</div>
	)
}