"use client"

import React from 'react'
import { useTaskStore } from '../store/taskStore'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Calendar, Target } from 'lucide-react'

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
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5 text-primary" />
					Today's Progress
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Target className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium text-muted-foreground">{todaysTasks.length} tasks</span>
					</div>
					<span className="text-2xl font-bold text-primary">{avgProgress}%</span>
				</div>
				<Progress value={avgProgress} className="h-3" />
			</CardContent>
		</Card>
	)
}