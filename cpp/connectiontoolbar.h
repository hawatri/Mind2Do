#ifndef CONNECTIONTOOLBAR_H
#define CONNECTIONTOOLBAR_H

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

#include "mindmapnode.h"

class ConnectionToolbar : public QWidget
{
    Q_OBJECT

public:
    explicit ConnectionToolbar(QWidget *parent = nullptr);
    ~ConnectionToolbar();

    // Connection management
    void setSelectedNodes(const QList<MindMapNode*> &nodes);
    QList<MindMapNode*> getSelectedNodes() const { return m_selectedNodes; }
    void clearSelection();

    // Connection operations
    void createConnection();
    void removeConnection();
    void clearConnections();

signals:
    void connectionCreated(MindMapNode *fromNode, MindMapNode *toNode);
    void connectionRemoved(MindMapNode *fromNode, MindMapNode *toNode);
    void connectionsCleared();

private slots:
    void onCreateConnectionClicked();
    void onRemoveConnectionClicked();
    void onClearConnectionsClicked();

private:
    // Core components
    QList<MindMapNode*> m_selectedNodes;

    // UI components
    QHBoxLayout *m_mainLayout;
    QLabel *m_selectionLabel;
    QPushButton *m_createConnectionButton;
    QPushButton *m_removeConnectionButton;
    QPushButton *m_clearConnectionsButton;

    // Methods
    void setupUI();
    void setupConnections();
    void updateUI();
    void updateSelectionLabel();
    void updateButtonStates();
    bool canCreateConnection() const;
    bool canRemoveConnection() const;
    bool canClearConnections() const;
    QString getSelectionText() const;

    // Constants
    static const QString NO_SELECTION_TEXT;
    static const QString SINGLE_SELECTION_TEXT;
    static const QString MULTI_SELECTION_TEXT;
};

#endif // CONNECTIONTOOLBAR_H
