'use client'

import { useState } from 'react'
import { Task } from '@/types/database'
import { useTasks, useSubtasks, useTaskNotes } from '@/hooks/useTasks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  X, 
  Plus, 
  Edit, 
  Save, 
  XCircle,
  CheckCircle2,
  Circle,
  Trash2,
  MessageSquare,
  ListTodo
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
}

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'notes'>('details')
  const [isEditing, setIsEditing] = useState(false)
  
  // Task editing state
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority)
  const [priorityWeight] = useState(task.priority_weight)
  const [startDate, setStartDate] = useState(task.start_date)
  const [dueDate, setDueDate] = useState(task.due_date || '')
  const [status, setStatus] = useState(task.status)

  // Subtask creation state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('')

  // Note creation state
  const [newNoteContent, setNewNoteContent] = useState('')

  const { updateTask } = useTasks()
  const { subtasks, createSubtask, updateSubtask, deleteSubtask } = useSubtasks(task.id)
  const { notes, createNote, deleteNote } = useTaskNotes(task.id)

  const handleSaveTask = async () => {
    try {
      await updateTask(task.id, {
        title,
        description: description || null,
        priority,
        priority_weight: priorityWeight,
        start_date: startDate,
        due_date: dueDate || null,
        status,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleCreateSubtask = async () => {
    if (!newSubtaskTitle.trim()) return

    try {
      await createSubtask({
        title: newSubtaskTitle.trim(),
        description: newSubtaskDescription.trim() || undefined,
      })
      setNewSubtaskTitle('')
      setNewSubtaskDescription('')
    } catch (error) {
      console.error('Error creating subtask:', error)
    }
  }

  const handleSubtaskToggle = async (subtaskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    try {
      await updateSubtask(subtaskId, { status: newStatus })
    } catch (error) {
      console.error('Error updating subtask:', error)
    }
  }

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return

    try {
      await createNote(newNoteContent.trim())
      setNewNoteContent('')
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSaveTask}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('subtasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'subtasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListTodo className="w-4 h-4 mr-1" />
              Subtasks ({subtasks.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Notes ({notes.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={priority}
                                                 onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                                                 onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {task.description && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{task.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Details</h3>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">Priority:</dt>
                          <dd className="text-gray-900 capitalize">{task.priority} ({task.priority_weight}/10)</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Status:</dt>
                          <dd className="text-gray-900 capitalize">{task.status.replace('_', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Progress:</dt>
                          <dd className="text-gray-900">{task.completion_percentage}%</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Timeline</h3>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">Start Date:</dt>
                          <dd className="text-gray-900">{format(parseISO(task.start_date), 'PPP')}</dd>
                        </div>
                        {task.due_date && (
                          <div>
                            <dt className="text-gray-500">Due Date:</dt>
                            <dd className="text-gray-900">{format(parseISO(task.due_date), 'PPP')}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-gray-500">Created:</dt>
                          <dd className="text-gray-900">{format(parseISO(task.created_at), 'PPP')}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${task.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              {/* Create New Subtask */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Add New Subtask</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Subtask title"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Subtask description (optional)"
                    value={newSubtaskDescription}
                    onChange={(e) => setNewSubtaskDescription(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button 
                    onClick={handleCreateSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Subtask
                  </Button>
                </div>
              </div>

              {/* Subtasks List */}
              <div className="space-y-3">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleSubtaskToggle(subtask.id, subtask.status)}
                      className={`flex-shrink-0 mt-0.5 ${
                        subtask.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {subtask.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${
                        subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {subtask.title}
                      </h4>
                      {subtask.description && (
                        <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Created {format(parseISO(subtask.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSubtask(subtask.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No subtasks yet. Add one above to break down this task.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Create New Note */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Add New Note</h3>
                <div className="space-y-3">
                  <textarea
                    placeholder="Write a note or memo about this task..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button 
                    onClick={handleCreateNote}
                    disabled={!newNoteContent.trim()}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(parseISO(note.created_at), 'PPp')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No notes yet. Add one above to track progress or important details.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}