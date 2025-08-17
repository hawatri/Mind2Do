# Mind2Do

A modern, interactive mind mapping application that combines visual organization with task management capabilities.

## Overview

Mind2Do is a web-based application that transforms the traditional todo list into an interactive, visual experience. It allows users to create hierarchical mind maps where each node represents a task, idea, or concept that can be connected, formatted, and tracked through completion.

## Why This Project Exists

Traditional todo applications often present tasks as linear lists, which can be limiting when dealing with complex projects that have multiple interconnected components. Mind2Do addresses this limitation by providing a visual, hierarchical approach to task organization.

The project was built to solve several key challenges:

- **Complex Project Management**: When working on projects with multiple phases, dependencies, and related tasks, a linear list becomes difficult to navigate and understand
- **Visual Thinking**: Many people think and organize information visually rather than linearly
- **Task Relationships**: Understanding how tasks relate to each other is crucial for effective project planning and execution
- **Progress Tracking**: Visual representation makes it easier to see overall project progress and identify bottlenecks

## Key Features

### Mind Mapping Capabilities
- Hierarchical node structure with parent-child relationships
- Visual connections between related tasks
- Drag-and-drop node positioning
- Infinite canvas for unlimited expansion

### Task Management
- Task completion tracking with visual indicators
- Rich text editing for detailed descriptions
- Status management and progress visualization
- Multi-selection for bulk operations

### Content Enhancement
- Text formatting (bold, italic, underline, strikethrough)
- Color coding with highlight and text color options
- Media attachment support (images and documents)
- External link integration

### User Experience
- Dark and light theme support
- Auto-save functionality with browser storage
- Import/export capabilities for data portability
- Responsive design for various screen sizes
- Keyboard shortcuts for power users

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build System**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks and Context API
- **Icons**: Lucide React
- **Data Persistence**: Local Storage with auto-save

## Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation
1. Clone the repository
   ```bash
   git clone [repository-url]
   cd Mind2Do
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## Usage

### Creating Your First Mind Map
1. The application starts with a default root node
2. Click on any node to edit its title and description
3. Use the plus button to create child nodes
4. Drag nodes to organize them spatially
5. Use the connection tools to link related nodes

### Managing Tasks
- Click the checkbox to mark tasks as complete
- Use the formatting toolbar to style text content
- Add media attachments for additional context
- Export your mind map for sharing or backup

### Navigation
- Use the hand tool to pan around the canvas
- Ctrl+click to select multiple nodes
- Use the file operations to save and load your work

## Project Structure

```
src/
├── components/          # React components
│   ├── MindMap.tsx     # Main mind map container
│   ├── MindMapNode.tsx # Individual node component
│   ├── ConnectionLines.tsx # Visual connection rendering
│   ├── FormattingToolbar.tsx # Text formatting controls
│   ├── FileOperations.tsx # Import/export functionality
│   ├── ConnectionToolbar.tsx # Node connection tools
│   └── ThemeToggle.tsx # Theme switching
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── hooks/              # Custom React hooks
│   └── useAutoSave.ts  # Data persistence logic
├── types/              # TypeScript type definitions
│   └── index.ts        # Core data structures
└── App.tsx             # Main application component
```

## Contributing

This project is open to contributions. Please ensure that any changes maintain the professional aesthetic and functionality of the application.

## License

[Add your license information here]

## Contact

For questions or support regarding this project, please [add your contact information].
