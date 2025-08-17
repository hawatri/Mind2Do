#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QGraphicsView>
#include <QGraphicsScene>
#include <QToolBar>
#include <QStatusBar>
#include <QMenuBar>
#include <QMenu>
#include <QAction>
#include <QFileDialog>
#include <QMessageBox>
#include <QSettings>
#include <QTimer>
#include <QDockWidget>
#include <QSplitter>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QWidget>
#include <QFrame>
#include <QLabel>
#include <QPushButton>
#include <QSlider>
#include <QSpinBox>
#include <QComboBox>
#include <QCheckBox>
#include <QGroupBox>
#include <QTabWidget>
#include <QListWidget>
#include <QTreeWidget>
#include <QTableWidget>
#include <QTextEdit>
#include <QLineEdit>
#include <QProgressBar>
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

#include "mindmapview.h"
#include "mindmapscene.h"
#include "mindmapnode.h"
#include "filemanager.h"
#include "documentviewer.h"
#include "formattingtoolbar.h"
#include "connectiontoolbar.h"
#include "fileoperations.h"

QT_BEGIN_NAMESPACE
class QAction;
class QMenu;
class QMenuBar;
class QStatusBar;
class QToolBar;
class QDockWidget;
class QSplitter;
class QVBoxLayout;
class QHBoxLayout;
class QWidget;
class QFrame;
class QLabel;
class QPushButton;
class QSlider;
class QSpinBox;
class QComboBox;
class QCheckBox;
class QGroupBox;
class QTabWidget;
class QListWidget;
class QTreeWidget;
class QTableWidget;
class QTextEdit;
class QLineEdit;
class QProgressBar;
class QApplication;
class QScreen;
class QWindow;
class QSurfaceFormat;
class QOpenGLWidget;
class QOpenGLFunctions;
class QOpenGLBuffer;
class QOpenGLVertexArrayObject;
class QOpenGLShaderProgram;
class QOpenGLTexture;
class QOpenGLFramebufferObject;
class QOpenGLContext;
class QOpenGLVersionProfile;
class QOpenGLDebugLogger;
class QOpenGLTimerQuery;
class QOpenGLQuery;
class QOpenGLSync;
class QOpenGLPixelTransferOptions;
class QOpenGLTextureBlitter;
class QOpenGLPaintDevice;
class QOpenGLWindow;
class QOpenGLContextGroup;
class QOpenGLVersionFunctions;
class QOpenGLVersionFunctionsFactory;
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

    // Window management
    void setupUI();
    void setupMenus();
    void setupToolbars();
    void setupDockWidgets();
    void setupStatusBar();
    void setupCentralWidget();
    void setupActions();
    void setupConnections();

    // Scene management
    MindMapScene* getScene() const { return m_scene; }
    MindMapView* getView() const { return m_view; }
    FileManager* getFileManager() const { return m_fileManager; }

    // File operations
    void newMindMap();
    void openMindMap();
    void saveMindMap();
    void saveMindMapAs();
    void exportMindMap();
    void importMindMap();

    // View operations
    void zoomIn();
    void zoomOut();
    void resetZoom();
    void fitInView();
    void centerOnContent();
    void toggleGrid();
    void toggleAntialiasing();
    void toggleOpenGLRendering();

    // Node operations
    void createNode();
    void deleteNode();
    void duplicateNode();
    void selectAll();
    void deselectAll();

    // Connection operations
    void createConnection();
    void removeConnection();
    void clearConnections();

    // Formatting operations
    void boldText();
    void italicText();
    void underlineText();
    void strikethroughText();
    void highlightText();
    void changeTextColor();

    // Media operations
    void addImage();
    void addDocument();
    void removeMedia();
    void openMedia();

    // Help operations
    void showAbout();
    void showHelp();
    void showPreferences();

protected:
    // Window events
    void closeEvent(QCloseEvent *event) override;
    void resizeEvent(QResizeEvent *event) override;
    void moveEvent(QMoveEvent *event) override;
    void showEvent(QShowEvent *event) override;
    void hideEvent(QHideEvent *event) override;
    void changeEvent(QEvent *event) override;

private slots:
    // File slots
    void onNewMindMap();
    void onOpenMindMap();
    void onSaveMindMap();
    void onSaveMindMapAs();
    void onExportMindMap();
    void onImportMindMap();
    void onRecentFile();

    // Edit slots
    void onUndo();
    void onRedo();
    void onCut();
    void onCopy();
    void onPaste();
    void onDelete();
    void onSelectAll();
    void onDeselectAll();

    // View slots
    void onZoomIn();
    void onZoomOut();
    void onResetZoom();
    void onFitInView();
    void onCenterOnContent();
    void onToggleGrid();
    void onToggleAntialiasing();
    void onToggleOpenGLRendering();

    // Node slots
    void onCreateNode();
    void onDeleteNode();
    void onDuplicateNode();
    void onNodeSelected(MindMapNode *node);
    void onNodeDeselected(MindMapNode *node);
    void onNodeCreated(MindMapNode *node);
    void onNodeDeleted(MindMapNode *node);
    void onNodeMoved(MindMapNode *node, const QPointF &position);

    // Connection slots
    void onCreateConnection();
    void onRemoveConnection();
    void onClearConnections();
    void onConnectionCreated(MindMapNode *fromNode, MindMapNode *toNode);
    void onConnectionRemoved(MindMapNode *fromNode, MindMapNode *toNode);

    // Formatting slots
    void onBoldText();
    void onItalicText();
    void onUnderlineText();
    void onStrikethroughText();
    void onHighlightText();
    void onChangeTextColor();

    // Media slots
    void onAddImage();
    void onAddDocument();
    void onRemoveMedia();
    void onOpenMedia();

    // Help slots
    void onAbout();
    void onHelp();
    void onPreferences();

    // Auto-save slots
    void onAutoSaveTimeout();
    void onMindMapSaved();
    void onMindMapLoaded();

    // Status slots
    void onZoomChanged(qreal zoom);
    void onViewportChanged();
    void onNodeClicked(MindMapNode *node);
    void onNodeDoubleClicked(MindMapNode *node);
    void onContextMenuRequested(const QPoint &pos);

private:
    // Core components
    MindMapScene *m_scene;
    MindMapView *m_view;
    FileManager *m_fileManager;
    DocumentViewer *m_documentViewer;
    FormattingToolbar *m_formattingToolbar;
    ConnectionToolbar *m_connectionToolbar;
    FileOperations *m_fileOperations;

    // UI components
    QDockWidget *m_documentViewerDock;
    QDockWidget *m_formattingToolbarDock;
    QDockWidget *m_connectionToolbarDock;
    QDockWidget *m_fileOperationsDock;

    // Menus
    QMenu *m_fileMenu;
    QMenu *m_editMenu;
    QMenu *m_viewMenu;
    QMenu *m_nodeMenu;
    QMenu *m_connectionMenu;
    QMenu *m_formattingMenu;
    QMenu *m_mediaMenu;
    QMenu *m_helpMenu;
    QMenu *m_recentFilesMenu;

    // Toolbars
    QToolBar *m_fileToolBar;
    QToolBar *m_editToolBar;
    QToolBar *m_viewToolBar;
    QToolBar *m_nodeToolBar;
    QToolBar *m_connectionToolBar;
    QToolBar *m_formattingToolBar;
    QToolBar *m_mediaToolBar;

    // Actions
    QAction *m_newAction;
    QAction *m_openAction;
    QAction *m_saveAction;
    QAction *m_saveAsAction;
    QAction *m_exportAction;
    QAction *m_importAction;
    QAction *m_exitAction;

    QAction *m_undoAction;
    QAction *m_redoAction;
    QAction *m_cutAction;
    QAction *m_copyAction;
    QAction *m_pasteAction;
    QAction *m_deleteAction;
    QAction *m_selectAllAction;
    QAction *m_deselectAllAction;

    QAction *m_zoomInAction;
    QAction *m_zoomOutAction;
    QAction *m_resetZoomAction;
    QAction *m_fitInViewAction;
    QAction *m_centerOnContentAction;
    QAction *m_toggleGridAction;
    QAction *m_toggleAntialiasingAction;
    QAction *m_toggleOpenGLRenderingAction;

    QAction *m_createNodeAction;
    QAction *m_deleteNodeAction;
    QAction *m_duplicateNodeAction;

    QAction *m_createConnectionAction;
    QAction *m_removeConnectionAction;
    QAction *m_clearConnectionsAction;

    QAction *m_boldAction;
    QAction *m_italicAction;
    QAction *m_underlineAction;
    QAction *m_strikethroughAction;
    QAction *m_highlightAction;
    QAction *m_textColorAction;

    QAction *m_addImageAction;
    QAction *m_addDocumentAction;
    QAction *m_removeMediaAction;
    QAction *m_openMediaAction;

    QAction *m_aboutAction;
    QAction *m_helpAction;
    QAction *m_preferencesAction;

    // Status bar
    QStatusBar *m_statusBar;
    QLabel *m_statusLabel;
    QLabel *m_zoomLabel;
    QLabel *m_nodeCountLabel;
    QProgressBar *m_progressBar;

    // Settings
    QSettings *m_settings;
    QStringList m_recentFiles;
    QString m_currentFilePath;
    bool m_isModified;

    // Auto-save
    QTimer *m_autoSaveTimer;

    // Methods
    void setupActions();
    void setupMenus();
    void setupToolbars();
    void setupDockWidgets();
    void setupStatusBar();
    void setupConnections();
    void updateRecentFiles();
    void updateWindowTitle();
    void updateStatusBar();
    void saveSettings();
    void loadSettings();
    void setupAutoSave();
    void updateActions();
    void updateMenus();
    void updateToolbars();
    void updateDockWidgets();
    void updateStatusBar();
    void updateWindowTitle();
    void updateRecentFiles();
    void updateActions();
    void updateMenus();
    void updateToolbars();
    void updateDockWidgets();
    void updateStatusBar();
    void updateWindowTitle();
    void updateRecentFiles();

    // Constants
    static const int MAX_RECENT_FILES = 10;
    static const int AUTO_SAVE_INTERVAL = 5000; // 5 seconds
    static const QString SETTINGS_GROUP_MAIN_WINDOW;
    static const QString SETTINGS_KEY_GEOMETRY;
    static const QString SETTINGS_KEY_STATE;
    static const QString SETTINGS_KEY_RECENT_FILES;
    static const QString SETTINGS_KEY_CURRENT_FILE;
    static const QString SETTINGS_KEY_ZOOM;
    static const QString SETTINGS_KEY_GRID_VISIBLE;
    static const QString SETTINGS_KEY_ANTIALIASING;
    static const QString SETTINGS_KEY_OPENGL_RENDERING;
};

#endif // MAINWINDOW_H
