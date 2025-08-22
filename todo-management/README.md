# Todo & Task Management Website

A comprehensive task management application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🎯 Task & Subtask Management
- Create tasks with title, description, priority, and notes
- Break tasks into subtasks for better organization
- Automatic progress calculation based on completed subtasks
- Support for single-day, multi-day, weekly, and monthly tasks

### 📊 Progress Tracking
- **Daily Progress View**: Shows completion percentage for today's tasks
- **Task Progress View**: Multi-day task progress based on subtasks
- Real-time progress updates with visual progress bars
- Track ongoing tasks with daily updates

### 📅 Weekly & Monthly Planning
- **Weekly View**: Plan and schedule tasks across all days of the week
- **Monthly View**: Calendar grid with task distribution and monthly reports
- Visual progress indicators for each day/week/month
- Quick task creation from calendar views

### ⭐ Prioritization & Filtering
- Priority levels: High, Medium, Low (with 1-10 weight system)
- Filter and sort by priority, due date, or completion status
- Visual priority indicators with color coding
- Advanced filtering options

### 📝 Notes, Memos & History
- Rich notes/memos for each task and subtask
- Progress logging with timestamps
- Complete task history with timeline view
- Detailed completion analytics

### 🎨 Modern UI & Experience
- **Dashboard**: Today's tasks, progress summary, upcoming tasks
- **Task Cards**: Progress bars, priority indicators, due dates, quick actions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live synchronization across all views

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Custom components with Lucide React icons
- **Date Handling**: date-fns for robust date operations
- **Real-time**: Supabase real-time subscriptions

## Setup Instructions

### 1. Database Setup

First, you need to run the database schema in your Supabase project:

1. Go to your Supabase dashboard: https://roihjjoynzsgogeaqjal.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create all tables, functions, triggers, and RLS policies

### 2. Environment Configuration

The environment variables are already configured in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://roihjjoynzsgogeaqjal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaWhqam95bnpzZ29nZWFxamFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTc2NDEsImV4cCI6MjA3MTQzMzY0MX0.ocXE0_MukxMV7ecxmpuQC35r79Sj9x0GcAtMeUI7F5I
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

1. **tasks** - Main task information
   - Basic task details (title, description, priority)
   - Timeline (start_date, due_date)
   - Progress tracking (completion_percentage, status)
   - User association and timestamps

2. **subtasks** - Task breakdown
   - Linked to parent tasks
   - Simple completion tracking
   - Automatic parent task progress updates

3. **task_notes** - Rich notes and memos
   - Timestamped entries
   - Progress logging and important details

### Key Features

- **Automatic Progress Calculation**: Subtask completion automatically updates parent task progress
- **Row Level Security**: Users can only access their own data
- **Real-time Updates**: Changes sync instantly across all clients
- **Audit Trail**: All changes are timestamped for history tracking

## Usage Guide

### Creating Tasks
1. Click "New Task" from any view
2. Fill in task details (title is required)
3. Set priority and dates
4. Save to create the task

### Managing Subtasks
1. Open any task by clicking on its title
2. Go to the "Subtasks" tab
3. Add subtasks to break down the work
4. Check off subtasks as you complete them
5. Watch the parent task progress update automatically

### Adding Notes
1. Open any task detail view
2. Go to the "Notes" tab
3. Add progress updates, important details, or memos
4. Notes are timestamped and saved permanently

### Planning Views
- **Weekly**: Drag and drop tasks across days, see weekly progress
- **Monthly**: Calendar overview with task distribution
- **History**: Review completed tasks with analytics

### Filtering & Sorting
- Use priority filters to focus on important tasks
- Filter by status to see pending, in-progress, or completed tasks
- Sort by due date to prioritize urgent items

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── tasks/          # Task management components
│   ├── planning/       # Calendar and planning views
│   ├── history/        # History and analytics
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and Supabase client
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own task management application.
