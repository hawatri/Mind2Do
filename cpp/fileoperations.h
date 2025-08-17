#ifndef FILEOPERATIONS_H
#define FILEOPERATIONS_H

#include <QWidget>
#include <QToolBar>
#include <QAction>
#include <QPushButton>
#include <QLabel>
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QFrame>
#include <QGroupBox>
#include <QCheckBox>
#include <QRadioButton>
#include <QComboBox>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include <QSlider>
#include <QLineEdit>
#include <QTextEdit>
#include <QListWidget>
#include <QTreeWidget>
#include <QTableWidget>
#include <QTabWidget>
#include <QSplitter>
#include <QDockWidget>
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

#include "mindmapscene.h"
#include "filemanager.h"

class FileOperations : public QWidget
{
    Q_OBJECT

public:
    explicit FileOperations(QWidget *parent = nullptr);
    ~FileOperations();

    // Scene management
    void setScene(MindMapScene *scene);
    MindMapScene* getScene() const { return m_scene; }
    void setFileManager(FileManager *fileManager);
    FileManager* getFileManager() const { return m_fileManager; }

    // File operations
    void saveMindMap();
    void loadMindMap();
    void exportMindMap();
    void importMindMap();

signals:
    void mindMapSaved();
    void mindMapLoaded();
    void mindMapExported();
    void mindMapImported();

private slots:
    void onSaveClicked();
    void onLoadClicked();
    void onExportClicked();
    void onImportClicked();

private:
    // Core components
    MindMapScene *m_scene;
    FileManager *m_fileManager;

    // UI components
    QHBoxLayout *m_mainLayout;
    QPushButton *m_saveButton;
    QPushButton *m_loadButton;
    QPushButton *m_exportButton;
    QPushButton *m_importButton;

    // Methods
    void setupUI();
    void setupConnections();
    void updateUI();
    void updateButtonStates();
    bool canSave() const;
    bool canLoad() const;
    bool canExport() const;
    bool canImport() const;

    // Constants
    static const QString DEFAULT_SAVE_FILTER;
    static const QString DEFAULT_LOAD_FILTER;
    static const QString DEFAULT_EXPORT_FILTER;
    static const QString DEFAULT_IMPORT_FILTER;
};

#endif // FILEOPERATIONS_H
