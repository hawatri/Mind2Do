# Mind2Do - C++ Qt Application

A modern, interactive mind mapping application built with Qt C++ that replicates the functionality of the web-based Mind2Do application.

## Overview

Mind2Do C++ is a desktop application that provides the same visual mind mapping capabilities as the web version, with enhanced performance and native desktop integration. It allows users to create hierarchical mind maps where each node represents a task, idea, or concept that can be connected, formatted, and tracked through completion.

## Features

### Core Mind Mapping
- **Hierarchical Node Structure**: Create parent-child relationships between tasks
- **Visual Connections**: Draw connections between related nodes
- **Drag & Drop**: Intuitive node positioning and movement
- **Infinite Canvas**: Unlimited workspace for complex mind maps
- **Zoom & Pan**: Navigate large mind maps with smooth zooming and panning

### Task Management
- **Task Completion Tracking**: Visual indicators for completed tasks
- **Rich Text Editing**: Detailed descriptions with formatting
- **Status Management**: Track progress and visualize bottlenecks
- **Multi-Selection**: Select and manage multiple nodes simultaneously

### Content Enhancement
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Color Coding**: Highlight and text color options
- **Media Attachments**: Support for images and documents
- **File Path Management**: Reference external files without embedding

### User Experience
- **Native Desktop Performance**: Fast, responsive interface
- **Auto-Save**: Automatic saving with configurable intervals
- **Import/Export**: Save and load mind maps in various formats
- **Recent Files**: Quick access to recently opened files
- **Keyboard Shortcuts**: Power user shortcuts for efficiency

### File Management
- **PDF Support**: Open PDF files with default applications
- **Image Support**: View and manage image attachments
- **Document Support**: Handle various document formats
- **File Path Remembering**: Automatic path storage for quick access

## Technology Stack

- **Framework**: Qt 6.x
- **Language**: C++17
- **Build System**: qmake
- **Graphics**: QGraphicsScene/QGraphicsView
- **File Handling**: Native Qt file operations
- **Settings**: QSettings for persistent storage

## Building the Application

### Prerequisites

- Qt 6.x (Qt 6.2 or later recommended)
- C++17 compatible compiler
- CMake 3.16+ (optional, for CMake build)

### Build Instructions

#### Using qmake (Recommended)

1. **Install Qt 6.x**
   ```bash
   # Download and install Qt 6.x from qt.io
   # Or use package manager on Linux
   sudo apt install qt6-base-dev qt6-tools-dev
   ```

2. **Clone and Build**
   ```bash
   cd cpp
   qmake Mind2Do.pro
   make
   # or on Windows with MSVC:
   # nmake
   ```

3. **Run the Application**
   ```bash
   ./Mind2Do
   # or on Windows:
   # Mind2Do.exe
   ```

#### Using CMake (Alternative)

1. **Create CMakeLists.txt** (if not provided)
2. **Build with CMake**
   ```bash
   mkdir build
   cd build
   cmake ..
   make
   ```

### Development Setup

1. **Open in Qt Creator**
   - Open `Mind2Do.pro` in Qt Creator
   - Configure kit with Qt 6.x
   - Build and run

2. **IDE Integration**
   - Works with Visual Studio, CLion, or any C++ IDE
   - Configure Qt paths in your IDE settings

## Project Structure

```
cpp/
├── Mind2Do.pro              # Qt project file
├── main.cpp                 # Application entry point
├── mainwindow.h/cpp         # Main window implementation
├── mindmapnode.h/cpp        # Individual node component
├── mindmapscene.h/cpp       # Graphics scene management
├── mindmapview.h/cpp        # Graphics view with zoom/pan
├── filemanager.h/cpp        # File operations and management
├── documentviewer.h/cpp     # Document/media viewer
├── formattingtoolbar.h/cpp  # Text formatting controls
├── connectiontoolbar.h/cpp  # Connection management
├── fileoperations.h/cpp     # Save/load operations
├── resources.qrc            # Application resources
└── README.md               # This file
```

## Usage

### Creating Your First Mind Map

1. **Launch the Application**: Start Mind2Do C++
2. **Default Node**: The application starts with a default root node
3. **Edit Content**: Click on nodes to edit titles and descriptions
4. **Create Children**: Use the "Add Child" button or right-click menu
5. **Organize**: Drag nodes to arrange them spatially
6. **Connect**: Use the connection tools to link related nodes

### Managing Tasks

- **Complete Tasks**: Click the checkbox to mark tasks as complete
- **Format Text**: Use the formatting toolbar for text styling
- **Add Media**: Attach images and documents to nodes
- **Save Work**: Use Ctrl+S or the save button to save your mind map

### Navigation

- **Zoom**: Use mouse wheel or zoom buttons
- **Pan**: Hold middle mouse button and drag
- **Select**: Click to select single nodes, Ctrl+click for multiple
- **Context Menu**: Right-click for additional options

### File Management

- **Add Files**: Use the document viewer to add file references
- **Open Files**: Double-click file references to open with default applications
- **PDF Support**: PDF files are automatically remembered for quick access
- **File Paths**: Store file paths instead of embedding large files

## Configuration

### Settings

The application stores settings in:
- **Windows**: `HKEY_CURRENT_USER\Software\Mind2Do`
- **macOS**: `~/Library/Preferences/com.mind2do.Mind2Do.plist`
- **Linux**: `~/.config/Mind2Do/Mind2Do.conf`

### Auto-Save

- **Interval**: Configurable auto-save interval (default: 5 seconds)
- **Location**: Auto-save files stored in user data directory
- **Recovery**: Automatic recovery of unsaved changes

## Performance

### Optimizations

- **OpenGL Rendering**: Optional OpenGL acceleration for large mind maps
- **Lazy Loading**: Media files loaded on demand
- **Efficient Storage**: File paths instead of embedded data
- **Memory Management**: Proper cleanup of graphics resources

### System Requirements

- **Minimum**: 2GB RAM, 1GHz CPU, 100MB disk space
- **Recommended**: 4GB RAM, 2GHz CPU, 500MB disk space
- **Graphics**: OpenGL 3.0+ support (optional)

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure Qt 6.x is properly installed
   - Check compiler compatibility
   - Verify Qt paths in environment

2. **Runtime Errors**
   - Check Qt dependencies are installed
   - Verify file permissions for save locations
   - Check graphics driver compatibility

3. **Performance Issues**
   - Enable OpenGL rendering in settings
   - Reduce auto-save frequency
   - Close unnecessary applications

### Debug Mode

Build with debug symbols for troubleshooting:
```bash
qmake CONFIG+=debug Mind2Do.pro
make
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]

## Support

For issues and questions:
- Check the troubleshooting section
- Review Qt documentation
- Submit issues to the project repository

## Roadmap

### Planned Features

- **Collaboration**: Real-time collaborative editing
- **Cloud Sync**: Automatic cloud storage integration
- **Templates**: Pre-built mind map templates
- **Advanced Export**: PDF, SVG, and image export options
- **Plugin System**: Extensible functionality through plugins
- **Mobile Support**: Companion mobile application

### Version History

- **v1.0.0**: Initial release with core mind mapping features
- **v1.1.0**: Enhanced file management and PDF support
- **v1.2.0**: Performance improvements and UI refinements
