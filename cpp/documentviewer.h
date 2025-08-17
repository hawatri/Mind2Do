#ifndef DOCUMENTVIEWER_H
#define DOCUMENTVIEWER_H

#include <QWidget>
#include <QListWidget>
#include <QPushButton>
#include <QLabel>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QFrame>
#include <QScrollArea>
#include <QTextEdit>
#include <QLineEdit>
#include <QComboBox>
#include <QCheckBox>
#include <QGroupBox>
#include <QTabWidget>
#include <QTreeWidget>
#include <QTableWidget>
#include <QProgressBar>
#include <QSlider>
#include <QSpinBox>
#include <QDoubleSpinBox>
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

#include "mindmapnode.h"
#include "filemanager.h"

class DocumentViewer : public QWidget
{
    Q_OBJECT

public:
    explicit DocumentViewer(QWidget *parent = nullptr);
    ~DocumentViewer();

    // Document management
    void setSelectedNode(MindMapNode *node);
    MindMapNode* getSelectedNode() const { return m_selectedNode; }
    void clearSelection();

    // File operations
    void addFilePath();
    void removeFilePath(const QString &id);
    void openFilePath(const QString &id);
    void openLastPdf();

    // UI management
    void updateView();
    void refreshView();

signals:
    void filePathAdded(const QString &id, const QString &path, const QString &name);
    void filePathRemoved(const QString &id);
    void filePathOpened(const QString &id);

private slots:
    void onAddFilePathClicked();
    void onRemoveFilePathClicked();
    void onOpenFilePathClicked();
    void onOpenLastPdfClicked();
    void onFilePathDoubleClicked(QListWidgetItem *item);
    void onContextMenuRequested(const QPoint &pos);

private:
    // Core components
    MindMapNode *m_selectedNode;
    FileManager *m_fileManager;

    // UI components
    QVBoxLayout *m_mainLayout;
    QLabel *m_titleLabel;
    QLabel *m_descriptionLabel;
    QListWidget *m_filePathList;
    QPushButton *m_addFilePathButton;
    QPushButton *m_openLastPdfButton;
    QFrame *m_lastPdfFrame;
    QLabel *m_lastPdfLabel;
    QPushButton *m_openLastPdfButton2;

    // Methods
    void setupUI();
    void setupConnections();
    void updateFilePathList();
    void updateLastPdfSection();
    void showContextMenu(const QPoint &pos, const QString &filePathId);
    void createFilePathItem(const QString &id, const QString &path, const QString &name);
    void removeFilePathItem(const QString &id);
    void updateFilePathItem(const QString &id, const QString &path, const QString &name);
    QString getFilePathIdFromItem(QListWidgetItem *item) const;
    QString getFilePathFromItem(QListWidgetItem *item) const;
    QString getFileNameFromItem(QListWidgetItem *item) const;
    void setFilePathItemData(QListWidgetItem *item, const QString &id, const QString &path, const QString &name);
    void getFilePathItemData(QListWidgetItem *item, QString &id, QString &path, QString &name) const;

    // Constants
    static const QString ITEM_DATA_ID;
    static const QString ITEM_DATA_PATH;
    static const QString ITEM_DATA_NAME;
};

#endif // DOCUMENTVIEWER_H
