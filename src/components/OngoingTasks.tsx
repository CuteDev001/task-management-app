"use client"

import React from 'react'
import { useTaskStore } from '../store/taskStore'
import { differenceInCalendarDays, format } from 'date-fns'

export const OngoingTasks: React.FC = () => {
	const tasks = useTaskStore((s) => s.tasks)
	const ongoing = tasks.filter((t) => t.status !== 'Done' && differenceInCalendarDays(new Date(t.endDate), new Date(t.startDate)) >= 7)

	return (
		<div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
			<h3 className="text-lg font-semibold text-gray-800 mb-3">Ongoing Tasks</h3>
			<ul className="space-y-3">
				{ongoing.map((t) => (
					<li key={t.id} className="border rounded-md p-3">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium text-gray-900">{t.title}</div>
								<div className="text-xs text-gray-600">{format(new Date(t.startDate), 'MMM d')} - {format(new Date(t.endDate), 'MMM d, yyyy')}</div>
							</div>
							<div className="text-sm text-gray-700">{t.progress}%</div>
						</div>
						<div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-emerald-500" style={{ width: `${t.progress}%` }} />
						</div>
						<div className="text-xs text-gray-600 mt-1">{t.subtasks.filter(st => st.completed).length} of {t.subtasks.length} subtasks</div>
					</li>
				))}
				{ongoing.length === 0 && <li className="text-sm text-gray-500">No ongoing long-term tasks.</li>}
			</ul>
		</div>
	)
}