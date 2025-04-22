# Task Management Application

A modern task management application built with React, TypeScript, and Zustand. This application helps users organize their tasks, track progress, and manage subtasks efficiently.

## Features

- Task Creation and Management
- Subtask Support
- Progress Tracking
- Priority Levels
- Status Updates
- Responsive Design
- User Authentication
- Weather Widget Integration

## Technologies Used

- React
- TypeScript
- Zustand (State Management)
- Tailwind CSS
- date-fns
- Firebase Authentication
- Radix UI Components

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Register or login to your account
2. Create new tasks with title, description, priority, and dates
3. Add subtasks to break down complex tasks
4. Track progress through the progress bar
5. Update task status as you work
6. View weather information while planning your tasks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/     # React components
├── store/         # State management
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
``` 