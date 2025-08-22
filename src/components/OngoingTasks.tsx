"use client"

import React from 'react'
import { useTaskStore } from '../store/taskStore'
import { differenceInCalendarDays, format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Clock, Target, CheckCircle } from 'lucide-react'

export const OngoingTasks: React.FC = () => {
	const tasks = useTaskStore((s) => s.tasks)
	const ongoing = tasks.filter((t) => t.status !== 'Done' && differenceInCalendarDays(new Date(t.endDate), new Date(t.startDate)) >= 7)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-5 w-5 text-primary" />
					Ongoing Tasks
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{ongoing.map((t) => (
						<div key={t.id} className="space-y-3 p-3 rounded-lg border bg-muted/30">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="font-medium">{t.title}</div>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<Target className="h-3 w-3" />
										{format(new Date(t.startDate), 'MMM d')} - {format(new Date(t.endDate), 'MMM d, yyyy')}
									</div>
								</div>
								<div className="text-sm font-semibold text-primary">{t.progress}%</div>
							</div>
							<Progress value={t.progress} className="h-2" />
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<CheckCircle className="h-3 w-3" />
								{t.subtasks.filter(st => st.completed).length} of {t.subtasks.length} subtasks
							</div>
						</div>
					))}
					{ongoing.length === 0 && (
						<div className="text-center py-8 text-muted-foreground">
							<Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
							<p className="text-sm">No ongoing long-term tasks.</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}