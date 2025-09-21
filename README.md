# 🧠 Mind2Do

> **A modern, interactive mind mapping application that transforms your ideas into visual, manageable tasks**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)

**Transform your thoughts into actionable visual maps** - Mind2Do combines the power of mind mapping with practical task management, helping you organize complex projects and ideas in an intuitive, visual way.

## Overview

Mind2Do is a web-based application that transforms the traditional todo list into an interactive, visual experience. It allows users to create hierarchical mind maps where each node represents a task, idea, or concept that can be connected, formatted, and tracked through completion.

## Why This Project Exists

Traditional todo applications often present tasks as linear lists, which can be limiting when dealing with complex projects that have multiple interconnected components. Mind2Do addresses this limitation by providing a visual, hierarchical approach to task organization.

The project was built to solve several key challenges:

- **Complex Project Management**: When working on projects with multiple phases, dependencies, and related tasks, a linear list becomes difficult to navigate and understand
- **Visual Thinking**: Many people think and organize information visually rather than linearly
- **Task Relationships**: Understanding how tasks relate to each other is crucial for effective project planning and execution
- **Progress Tracking**: Visual representation makes it easier to see overall project progress and identify bottlenecks

## ✨ Key Features

### 🗺️ Mind Mapping Capabilities
- **Hierarchical Structure** - Create parent-child relationships between tasks
- **Visual Connections** - Link related tasks with intuitive connection lines
- **Drag & Drop** - Reposition nodes freely on an infinite canvas
- **Resizable Nodes** - Adjust node size to fit your content perfectly
- **Word-by-Word Editing** - Edit individual words inline for precise control

### ✅ Task Management
- **Progress Tracking** - Visual completion indicators with checkboxes
- **Rich Text Editing** - Detailed descriptions with full formatting support
- **Multi-Selection** - Select and manage multiple nodes simultaneously
- **Status Visualization** - See your project progress at a glance

### 🎨 Content Enhancement
- **Text Formatting** - Bold, italic, underline, strikethrough options
- **Color Coding** - Highlight and text color customization
- **Media Attachments** - Images, documents, and external links
- **PDF Integration** - Smart file path management with auto-opening
- **Font Options** - Multiple font families and sizes
- **Text Alignment** - Left, center, right, and justify options

### 🚀 User Experience
- **Dark/Light Themes** - Toggle between themes seamlessly
- **Auto-Save** - Never lose your work with automatic saving
- **Import/Export** - Backup and share your mind maps
- **Responsive Design** - Works perfectly on desktop and mobile
- **AI Integration** - Chat with AI about your documents and tasks

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build System**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks and Context API
- **Icons**: Lucide React
- **Data Persistence**: Local Storage with auto-save

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Mind2Do.git
   cd Mind2Do
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### 🏗️ Building for Production
```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📖 How to Use Mind2Do

### 🎯 Getting Started
1. **Create Your First Node** - The app starts with a default root node
2. **Edit Content** - Click on any node to edit its title and description
3. **Add Child Nodes** - Use the "Add Child" button to create sub-tasks
4. **Organize Spatially** - Drag nodes around to arrange them logically
5. **Connect Ideas** - Use connection tools to link related concepts

### ✏️ Advanced Editing
- **Word-by-Word Editing** - Click individual words to edit them inline
- **Rich Formatting** - Use the formatting toolbar for text styling
- **Resize Nodes** - Drag the resize handles to fit your content
- **Multi-Selection** - Ctrl+click to select multiple nodes
- **Bulk Operations** - Apply changes to multiple nodes at once

### 📎 Media & Attachments
- **Upload Files** - Add images, documents, and PDFs to nodes
- **Smart PDF Handling** - Automatic file path remembering
- **External Links** - Embed YouTube videos, audio, and web links
- **AI Document Chat** - Ask questions about your attached documents

### 🎨 Customization
- **Theme Toggle** - Switch between dark and light modes
- **Color Coding** - Use highlights and text colors for organization
- **Font Options** - Choose from multiple font families and sizes
- **Text Alignment** - Align text left, center, right, or justify

### 💾 Data Management
- **Auto-Save** - Your work is automatically saved to browser storage
- **Import/Export** - Backup and share your mind maps
- **File Operations** - Save and load your projects
- **Cross-Device Sync** - Access your maps from any device

## 🎬 Live Demo

> **Try Mind2Do right now!** [Live Demo](https://your-demo-url.com) *(Replace with your actual demo URL)*

### 🖼️ Screenshots
*Add screenshots of your application here to showcase the interface*

## 🏗️ Project Structure

```
src/
├── components/              # React components
│   ├── MindMap.tsx         # Main mind map container
│   ├── MindMapNode.tsx     # Individual node component
│   ├── ConnectionLines.tsx # Visual connection rendering
│   ├── FormattingToolbar.tsx # Text formatting controls
│   ├── FileOperations.tsx # Import/export functionality
│   ├── ConnectionToolbar.tsx # Node connection tools
│   ├── DocumentViewer.tsx # Document and AI chat interface
│   ├── MediaPlayer.tsx    # Media playback component
│   └── ThemeToggle.tsx    # Theme switching
├── contexts/               # React contexts
│   └── ThemeContext.tsx   # Theme management
├── hooks/                  # Custom React hooks
│   ├── useAutoSave.ts     # Data persistence logic
│   ├── useFilePaths.ts    # File path management
│   └── useDocumentProcessor.ts # Document processing
├── types/                  # TypeScript type definitions
│   └── index.ts           # Core data structures
└── App.tsx                # Main application component
```

## 🤝 Contributing

We welcome contributions to Mind2Do! Here's how you can help:

### 🐛 Bug Reports
- Use the GitHub Issues tab to report bugs
- Include steps to reproduce the issue
- Provide screenshots if applicable

### 💡 Feature Requests
- Suggest new features via GitHub Issues
- Describe the use case and expected behavior
- Consider the impact on existing functionality

### 🔧 Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📋 Development Guidelines
- Follow the existing code style and patterns
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/Mind2Do/issues)
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
