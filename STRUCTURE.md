# Project Structure

This document outlines the directory structure and the purpose of each file in the Todoist Clone project.

## 📁 Root Directory
- `CHANGELOG.md`: Log of all notable changes and versioning.
- `STRUCTURE.md`: This file, documenting the project's architecture.
- `README.md`: Main project documentation and setup instructions.
- `netlify.toml`: Configuration for Netlify deployment (alternative hosting).
- `package.json`: Project dependencies and scripts.
- `tailwind.config.js`: Tailwind CSS configuration for the design system.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite build tool configuration, including base path for GitHub Pages.

## 📁 src/
The core source code of the application.

### 📁 components/
Reusable React components organized by feature.

#### 📁 Layout/
- `Header.tsx`: Top navigation bar with Dark Mode toggle and Data Export.
- `Sidebar.tsx`: Left navigation for filters (Today, Upcoming, Completed) and Projects.

#### 📁 Project/
- `CreateProjectModal.tsx`: Dialog for adding and editing projects (categories).

#### 📁 Task/
- `AddTaskForm.tsx`: Form for creating new tasks with priority and due date selection.
- `TaskItem.tsx`: Individual task row with status toggle, inline editing, and countdown.
- `TaskList.tsx`: Container that renders the filtered list of tasks.
- `TaskOptionsDropdown.tsx`: "..." menu for advanced task operations (Move, Delete, Priority).

#### 📁 UI/
- `DatePicker.tsx`: Custom date and time picker component with local timezone support.

### 📁 stores/
- `taskStore.ts`: Central state management using Zustand (Tasks, Projects, Filters).

### 📁 types/
- `index.ts`: TypeScript interfaces and types used throughout the app.

### 📁 Others
- `main.tsx`: Application entry point.
- `App.tsx`: Root component managing layout, routing logic, and hotkeys.
- `index.css`: Global styles and Tailwind directives.
