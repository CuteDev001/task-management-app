import type React from "react"
import { useTaskStore } from "../store/taskStore"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { BarChart3, CheckCircle, AlertTriangle, Zap, Target } from "lucide-react"

export const TaskOverview: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const completedTasks = tasks.filter((task) => task.status === 'Done').length
  const highPriorityTasks = tasks.filter((task) => task.priority === 'High').length
  const efficiency = tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0) / tasks.length) : 0

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "High Priority",
      value: highPriorityTasks,
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      label: "Avg Progress",
      value: `${efficiency}%`,
      icon: Target,
      color: "text-purple-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Task Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Pending Tasks</span>
            <span className="text-primary">{tasks.length - completedTasks}</span>
          </div>
          <Progress value={100 - efficiency} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
