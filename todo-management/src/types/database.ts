export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high'
          priority_weight: number
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          start_date: string
          due_date: string | null
          completion_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          priority_weight?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          start_date: string
          due_date?: string | null
          completion_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          priority_weight?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          start_date?: string
          due_date?: string | null
          completion_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          description: string | null
          status: 'pending' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          description?: string | null
          status?: 'pending' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      task_notes: {
        Row: {
          id: string
          task_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Task = Database['public']['Tables']['tasks']['Row']
export type Subtask = Database['public']['Tables']['subtasks']['Row']
export type TaskNote = Database['public']['Tables']['task_notes']['Row']