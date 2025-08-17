#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "mindmapview.h"
#include "mindmapscene.h"
#include "filemanager.h"
#include "documentviewer.h"
#include "formattingtoolbar.h"
#include "connectiontoolbar.h"
#include "fileoperations.h"

#include <QApplication>
#include <QMenuBar>
#include <QStatusBar>
#include <QToolBar>
#include <QDockWidget>
#include <QMessageBox>
#include <QFileDialog>
#include <QSettings>
#include <QTimer>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QAction>
#include <QMenu>
#include <QLabel>
#include <QProgressBar>
#include <QPushButton>
#include <QComboBox>
#include <QSpinBox>
#include <QSlider>
#include <QCheckBox>
#include <QGroupBox>
#include <QFrame>
#include <QTabWidget>
#include <QListWidget>
#include <QTreeWidget>
#include <QTableWidget>
#include <QTextEdit>
#include <QLineEdit>
#include <QApplication>
#include <QScreen>
#include <QWindow>
#include <QSurfaceFormat>
#include <QOpenGLWidget>
#include <QOpenGLFunctions>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLShaderProgram>
#include <QOpenGLTexture>
#include <QOpenGLFramebufferObject>
#include <QOpenGLContext>
#include <QOpenGLVersionProfile>
#include <QOpenGLDebugLogger>
#include <QOpenGLTimerQuery>
#include <QOpenGLQuery>
#include <QOpenGLSync>
#include <QOpenGLPixelTransferOptions>
#include <QOpenGLTextureBlitter>
#include <QOpenGLPaintDevice>
#include <QOpenGLWindow>
#include <QOpenGLContextGroup>
#include <QOpenGLVersionFunctions>
#include <QOpenGLVersionFunctionsFactory>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_scene(nullptr)
    , m_view(nullptr)
    , m_fileManager(nullptr)
    , m_documentViewer(nullptr)
    , m_formattingToolbar(nullptr)
    , m_connectionToolbar(nullptr)
    , m_fileOperations(nullptr)
    , m_documentViewerDock(nullptr)
    , m_formattingToolbarDock(nullptr)
    , m_connectionToolbarDock(nullptr)
    , m_fileOperationsDock(nullptr)
    , m_fileMenu(nullptr)
    , m_editMenu(nullptr)
    , m_viewMenu(nullptr)
    , m_nodeMenu(nullptr)
    , m_connectionMenu(nullptr)
    , m_formattingMenu(nullptr)
    , m_mediaMenu(nullptr)
    , m_helpMenu(nullptr)
    , m_recentFilesMenu(nullptr)
    , m_fileToolBar(nullptr)
    , m_editToolBar(nullptr)
    , m_viewToolBar(nullptr)
    , m_nodeToolBar(nullptr)
    , m_connectionToolBar(nullptr)
    , m_formattingToolBar(nullptr)
    , m_mediaToolBar(nullptr)
    , m_newAction(nullptr)
    , m_openAction(nullptr)
    , m_saveAction(nullptr)
    , m_saveAsAction(nullptr)
    , m_exportAction(nullptr)
    , m_importAction(nullptr)
    , m_exitAction(nullptr)
    , m_undoAction(nullptr)
    , m_redoAction(nullptr)
    , m_cutAction(nullptr)
    , m_copyAction(nullptr)
    , m_pasteAction(nullptr)
    , m_deleteAction(nullptr)
    , m_selectAllAction(nullptr)
    , m_deselectAllAction(nullptr)
    , m_zoomInAction(nullptr)
    , m_zoomOutAction(nullptr)
    , m_resetZoomAction(nullptr)
    , m_fitInViewAction(nullptr)
    , m_centerOnContentAction(nullptr)
    , m_toggleGridAction(nullptr)
    , m_toggleAntialiasingAction(nullptr)
    , m_toggleOpenGLRenderingAction(nullptr)
    , m_createNodeAction(nullptr)
    , m_deleteNodeAction(nullptr)
    , m_duplicateNodeAction(nullptr)
    , m_createConnectionAction(nullptr)
    , m_removeConnectionAction(nullptr)
    , m_clearConnectionsAction(nullptr)
    , m_boldAction(nullptr)
    , m_italicAction(nullptr)
    , m_underlineAction(nullptr)
    , m_strikethroughAction(nullptr)
    , m_highlightAction(nullptr)
    , m_textColorAction(nullptr)
    , m_addImageAction(nullptr)
    , m_addDocumentAction(nullptr)
    , m_removeMediaAction(nullptr)
    , m_openMediaAction(nullptr)
    , m_aboutAction(nullptr)
    , m_helpAction(nullptr)
    , m_preferencesAction(nullptr)
    , m_statusBar(nullptr)
    , m_statusLabel(nullptr)
    , m_zoomLabel(nullptr)
    , m_nodeCountLabel(nullptr)
    , m_progressBar(nullptr)
    , m_settings(nullptr)
    , m_currentFilePath()
    , m_isModified(false)
    , m_autoSaveTimer(nullptr)
{
    setupUI();
    setupActions();
    setupMenus();
    setupToolbars();
    setupDockWidgets();
    setupStatusBar();
    setupConnections();
    setupAutoSave();
    loadSettings();
    
    setWindowTitle("Mind2Do - Mind Mapping Application");
    resize(1200, 800);
}

MainWindow::~MainWindow()
{
    saveSettings();
    delete m_autoSaveTimer;
    delete m_settings;
}

void MainWindow::setupUI()
{
    // Create core components
    m_fileManager = new FileManager(this);
    m_scene = new MindMapScene(this);
    m_view = new MindMapView(this);
    
    // Set up the view
    m_view->setScene(m_scene);
    m_scene->setView(m_view);
    
    // Set central widget
    setCentralWidget(m_view);
    
    // Create dock widgets
    m_documentViewer = new DocumentViewer(this);
    m_formattingToolbar = new FormattingToolbar(this);
    m_connectionToolbar = new ConnectionToolbar(this);
    m_fileOperations = new FileOperations(this);
    
    // Set up file operations
    m_fileOperations->setScene(m_scene);
    m_fileOperations->setFileManager(m_fileManager);
    
    // Set up document viewer
    m_documentViewer->setFileManager(m_fileManager);
}

void MainWindow::setupActions()
{
    // File actions
    m_newAction = new QAction("&New", this);
    m_newAction->setShortcut(QKeySequence::New);
    m_newAction->setStatusTip("Create a new mind map");
    
    m_openAction = new QAction("&Open...", this);
    m_openAction->setShortcut(QKeySequence::Open);
    m_openAction->setStatusTip("Open an existing mind map");
    
    m_saveAction = new QAction("&Save", this);
    m_saveAction->setShortcut(QKeySequence::Save);
    m_saveAction->setStatusTip("Save the current mind map");
    
    m_saveAsAction = new QAction("Save &As...", this);
    m_saveAsAction->setShortcut(QKeySequence::SaveAs);
    m_saveAsAction->setStatusTip("Save the mind map with a new name");
    
    m_exitAction = new QAction("E&xit", this);
    m_exitAction->setShortcut(QKeySequence::Quit);
    m_exitAction->setStatusTip("Exit the application");
    
    // View actions
    m_zoomInAction = new QAction("Zoom &In", this);
    m_zoomInAction->setShortcut(QKeySequence::ZoomIn);
    m_zoomInAction->setStatusTip("Zoom in");
    
    m_zoomOutAction = new QAction("Zoom &Out", this);
    m_zoomOutAction->setShortcut(QKeySequence::ZoomOut);
    m_zoomOutAction->setStatusTip("Zoom out");
    
    m_resetZoomAction = new QAction("Reset &Zoom", this);
    m_resetZoomAction->setShortcut(QKeySequence("Ctrl+0"));
    m_resetZoomAction->setStatusTip("Reset zoom to 100%");
    
    // Node actions
    m_createNodeAction = new QAction("&Add Node", this);
    m_createNodeAction->setShortcut(QKeySequence("Ctrl+N"));
    m_createNodeAction->setStatusTip("Add a new node");
    
    m_deleteNodeAction = new QAction("&Delete Node", this);
    m_deleteNodeAction->setShortcut(QKeySequence::Delete);
    m_deleteNodeAction->setStatusTip("Delete the selected node");
}

void MainWindow::setupMenus()
{
    // File menu
    m_fileMenu = menuBar()->addMenu("&File");
    m_fileMenu->addAction(m_newAction);
    m_fileMenu->addAction(m_openAction);
    m_fileMenu->addAction(m_saveAction);
    m_fileMenu->addAction(m_saveAsAction);
    m_fileMenu->addSeparator();
    m_fileMenu->addAction(m_exitAction);
    
    // View menu
    m_viewMenu = menuBar()->addMenu("&View");
    m_viewMenu->addAction(m_zoomInAction);
    m_viewMenu->addAction(m_zoomOutAction);
    m_viewMenu->addAction(m_resetZoomAction);
    
    // Node menu
    m_nodeMenu = menuBar()->addMenu("&Node");
    m_nodeMenu->addAction(m_createNodeAction);
    m_nodeMenu->addAction(m_deleteNodeAction);
    
    // Help menu
    m_helpMenu = menuBar()->addMenu("&Help");
    m_aboutAction = new QAction("&About", this);
    m_helpMenu->addAction(m_aboutAction);
}

void MainWindow::setupToolbars()
{
    // File toolbar
    m_fileToolBar = addToolBar("File");
    m_fileToolBar->addAction(m_newAction);
    m_fileToolBar->addAction(m_openAction);
    m_fileToolBar->addAction(m_saveAction);
    
    // View toolbar
    m_viewToolBar = addToolBar("View");
    m_viewToolBar->addAction(m_zoomInAction);
    m_viewToolBar->addAction(m_zoomOutAction);
    m_viewToolBar->addAction(m_resetZoomAction);
    
    // Node toolbar
    m_nodeToolBar = addToolBar("Node");
    m_nodeToolBar->addAction(m_createNodeAction);
    m_nodeToolBar->addAction(m_deleteNodeAction);
}

void MainWindow::setupDockWidgets()
{
    // Document viewer dock
    m_documentViewerDock = new QDockWidget("Documents & Media", this);
    m_documentViewerDock->setWidget(m_documentViewer);
    addDockWidget(Qt::RightDockWidgetArea, m_documentViewerDock);
    
    // Formatting toolbar dock
    m_formattingToolbarDock = new QDockWidget("Formatting", this);
    m_formattingToolbarDock->setWidget(m_formattingToolbar);
    addDockWidget(Qt::TopDockWidgetArea, m_formattingToolbarDock);
    
    // Connection toolbar dock
    m_connectionToolbarDock = new QDockWidget("Connections", this);
    m_connectionToolbarDock->setWidget(m_connectionToolbar);
    addDockWidget(Qt::BottomDockWidgetArea, m_connectionToolbarDock);
    
    // File operations dock
    m_fileOperationsDock = new QDockWidget("File Operations", this);
    m_fileOperationsDock->setWidget(m_fileOperations);
    addDockWidget(Qt::LeftDockWidgetArea, m_fileOperationsDock);
}

void MainWindow::setupStatusBar()
{
    m_statusBar = statusBar();
    
    m_statusLabel = new QLabel("Ready");
    m_zoomLabel = new QLabel("Zoom: 100%");
    m_nodeCountLabel = new QLabel("Nodes: 0");
    m_progressBar = new QProgressBar();
    m_progressBar->setVisible(false);
    
    m_statusBar->addWidget(m_statusLabel, 1);
    m_statusBar->addPermanentWidget(m_zoomLabel);
    m_statusBar->addPermanentWidget(m_nodeCountLabel);
    m_statusBar->addPermanentWidget(m_progressBar);
}

void MainWindow::setupConnections()
{
    // File actions
    connect(m_newAction, &QAction::triggered, this, &MainWindow::onNewMindMap);
    connect(m_openAction, &QAction::triggered, this, &MainWindow::onOpenMindMap);
    connect(m_saveAction, &QAction::triggered, this, &MainWindow::onSaveMindMap);
    connect(m_saveAsAction, &QAction::triggered, this, &MainWindow::onSaveMindMapAs);
    connect(m_exitAction, &QAction::triggered, this, &QWidget::close);
    
    // View actions
    connect(m_zoomInAction, &QAction::triggered, this, &MainWindow::onZoomIn);
    connect(m_zoomOutAction, &QAction::triggered, this, &MainWindow::onZoomOut);
    connect(m_resetZoomAction, &QAction::triggered, this, &MainWindow::onResetZoom);
    
    // Node actions
    connect(m_createNodeAction, &QAction::triggered, this, &MainWindow::onCreateNode);
    connect(m_deleteNodeAction, &QAction::triggered, this, &MainWindow::onDeleteNode);
    
    // Scene signals
    connect(m_scene, &MindMapScene::nodeSelected, this, &MainWindow::onNodeSelected);
    connect(m_scene, &MindMapScene::nodeDeselected, this, &MainWindow::onNodeDeselected);
    connect(m_scene, &MindMapScene::nodeCreated, this, &MainWindow::onNodeCreated);
    connect(m_scene, &MindMapScene::nodeDeleted, this, &MainWindow::onNodeDeleted);
    connect(m_scene, &MindMapScene::nodeMoved, this, &MainWindow::onNodeMoved);
    
    // View signals
    connect(m_view, &MindMapView::zoomChanged, this, &MainWindow::onZoomChanged);
    connect(m_view, &MindMapView::viewportChanged, this, &MainWindow::onViewportChanged);
    
    // Help actions
    connect(m_aboutAction, &QAction::triggered, this, &MainWindow::onAbout);
}

void MainWindow::setupAutoSave()
{
    m_autoSaveTimer = new QTimer(this);
    connect(m_autoSaveTimer, &QTimer::timeout, this, &MainWindow::onAutoSaveTimeout);
    m_autoSaveTimer->start(5000); // 5 seconds
}

void MainWindow::saveSettings()
{
    if (!m_settings) {
        m_settings = new QSettings("Mind2Do", "Mind2Do", this);
    }
    
    m_settings->setValue("geometry", saveGeometry());
    m_settings->setValue("state", saveState());
    m_settings->setValue("currentFile", m_currentFilePath);
    m_settings->setValue("zoom", m_view->getZoom());
    m_settings->setValue("gridVisible", m_view->isGridVisible());
    m_settings->setValue("antialiasing", m_view->isAntialiasing());
    m_settings->setValue("openGLRendering", m_view->isOpenGLRendering());
}

void MainWindow::loadSettings()
{
    if (!m_settings) {
        m_settings = new QSettings("Mind2Do", "Mind2Do", this);
    }
    
    restoreGeometry(m_settings->value("geometry").toByteArray());
    restoreState(m_settings->value("state").toByteArray());
    m_currentFilePath = m_settings->value("currentFile").toString();
    
    qreal zoom = m_settings->value("zoom", 1.0).toReal();
    m_view->setZoom(zoom);
    
    bool gridVisible = m_settings->value("gridVisible", true).toBool();
    m_view->setGridVisible(gridVisible);
    
    bool antialiasing = m_settings->value("antialiasing", true).toBool();
    m_view->setAntialiasing(antialiasing);
    
    bool openGLRendering = m_settings->value("openGLRendering", false).toBool();
    m_view->setOpenGLRendering(openGLRendering);
}

// File slots
void MainWindow::onNewMindMap()
{
    if (m_isModified) {
        QMessageBox::StandardButton reply = QMessageBox::question(this, "Save Changes", 
            "Do you want to save your changes before creating a new mind map?",
            QMessageBox::Yes | QMessageBox::No | QMessageBox::Cancel);
        
        if (reply == QMessageBox::Yes) {
            onSaveMindMap();
        } else if (reply == QMessageBox::Cancel) {
            return;
        }
    }
    
    m_scene->clearScene();
    m_currentFilePath.clear();
    m_isModified = false;
    updateWindowTitle();
    m_statusLabel->setText("New mind map created");
}

void MainWindow::onOpenMindMap()
{
    QString filePath = QFileDialog::getOpenFileName(this, "Open Mind Map", 
        m_currentFilePath, "Mind Map Files (*.json);;All Files (*.*)");
    
    if (!filePath.isEmpty()) {
        m_scene->loadMindMap(filePath);
        m_currentFilePath = filePath;
        m_isModified = false;
        updateWindowTitle();
        m_statusLabel->setText("Mind map loaded: " + QFileInfo(filePath).fileName());
    }
}

void MainWindow::onSaveMindMap()
{
    if (m_currentFilePath.isEmpty()) {
        onSaveMindMapAs();
    } else {
        m_scene->saveMindMap(m_currentFilePath);
        m_isModified = false;
        updateWindowTitle();
        m_statusLabel->setText("Mind map saved");
    }
}

void MainWindow::onSaveMindMapAs()
{
    QString filePath = QFileDialog::getSaveFileName(this, "Save Mind Map", 
        m_currentFilePath, "Mind Map Files (*.json);;All Files (*.*)");
    
    if (!filePath.isEmpty()) {
        m_scene->saveMindMap(filePath);
        m_currentFilePath = filePath;
        m_isModified = false;
        updateWindowTitle();
        m_statusLabel->setText("Mind map saved as: " + QFileInfo(filePath).fileName());
    }
}

// View slots
void MainWindow::onZoomIn()
{
    m_view->zoomIn();
}

void MainWindow::onZoomOut()
{
    m_view->zoomOut();
}

void MainWindow::onResetZoom()
{
    m_view->resetZoom();
}

// Node slots
void MainWindow::onCreateNode()
{
    MindMapNode *selectedNode = m_scene->getSelectedNodes().isEmpty() ? nullptr : m_scene->getSelectedNodes().first();
    m_scene->createNode(selectedNode ? selectedNode->getId() : QString());
}

void MainWindow::onDeleteNode()
{
    QList<MindMapNode*> selectedNodes = m_scene->getSelectedNodes();
    if (!selectedNodes.isEmpty()) {
        m_scene->deleteNode(selectedNodes.first());
    }
}

void MainWindow::onNodeSelected(MindMapNode *node)
{
    m_documentViewer->setSelectedNode(node);
    m_formattingToolbar->setSelectedNode(node);
    updateStatusBar();
}

void MainWindow::onNodeDeselected(MindMapNode *node)
{
    m_documentViewer->clearSelection();
    m_formattingToolbar->clearSelection();
    updateStatusBar();
}

void MainWindow::onNodeCreated(MindMapNode *node)
{
    m_isModified = true;
    updateWindowTitle();
    updateStatusBar();
}

void MainWindow::onNodeDeleted(MindMapNode *node)
{
    m_isModified = true;
    updateWindowTitle();
    updateStatusBar();
}

void MainWindow::onNodeMoved(MindMapNode *node, const QPointF &position)
{
    m_isModified = true;
    updateWindowTitle();
}

// Status slots
void MainWindow::onZoomChanged(qreal zoom)
{
    m_zoomLabel->setText(QString("Zoom: %1%").arg(qRound(zoom * 100)));
}

void MainWindow::onViewportChanged()
{
    updateStatusBar();
}

void MainWindow::onAutoSaveTimeout()
{
    if (m_isModified) {
        m_scene->autoSave();
        m_statusLabel->setText("Auto-saved");
    }
}

void MainWindow::onAbout()
{
    QMessageBox::about(this, "About Mind2Do", 
        "Mind2Do - Mind Mapping Application\n\n"
        "Version 1.0.0\n"
        "A modern, interactive mind mapping application built with Qt C++.\n\n"
        "Features:\n"
        "- Hierarchical node structure\n"
        "- Visual connections\n"
        "- Text formatting\n"
        "- Media attachments\n"
        "- File path management\n"
        "- Auto-save functionality\n\n"
        "Built with Qt 6.x and C++17");
}

void MainWindow::updateWindowTitle()
{
    QString title = "Mind2Do";
    if (!m_currentFilePath.isEmpty()) {
        title += " - " + QFileInfo(m_currentFilePath).fileName();
    }
    if (m_isModified) {
        title += " *";
    }
    setWindowTitle(title);
}

void MainWindow::updateStatusBar()
{
    int nodeCount = m_scene->getAllNodes().size();
    m_nodeCountLabel->setText(QString("Nodes: %1").arg(nodeCount));
}

void MainWindow::closeEvent(QCloseEvent *event)
{
    if (m_isModified) {
        QMessageBox::StandardButton reply = QMessageBox::question(this, "Save Changes", 
            "Do you want to save your changes before exiting?",
            QMessageBox::Yes | QMessageBox::No | QMessageBox::Cancel);
        
        if (reply == QMessageBox::Yes) {
            onSaveMindMap();
            event->accept();
        } else if (reply == QMessageBox::No) {
            event->accept();
        } else {
            event->ignore();
        }
    } else {
        event->accept();
    }
}
