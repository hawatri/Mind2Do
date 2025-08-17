#ifndef MINDMAPVIEW_H
#define MINDMAPVIEW_H

#include <QGraphicsView>
#include <QGraphicsScene>
#include <QMouseEvent>
#include <QWheelEvent>
#include <QKeyEvent>
#include <QTimer>
#include <QPropertyAnimation>
#include <QGraphicsDropShadowEffect>
#include <QGraphicsOpacityEffect>
#include <QMenu>
#include <QAction>
#include <QFileDialog>
#include <QMessageBox>
#include <QApplication>
#include <QDesktopServices>
#include <QUrl>
#include <QProcess>
#include <QDir>
#include <QFileInfo>
#include <QMimeDatabase>
#include <QMimeType>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QSettings>
#include <QStandardPaths>
#include <QDir>
#include <QFile>
#include <QTextStream>
#include <QDateTime>
#include <QUuid>
#include <QScrollBar>
#include <QToolTip>
#include <QStatusBar>
#include <QProgressBar>
#include <QLabel>
#include <QSlider>
#include <QPushButton>
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QWidget>
#include <QFrame>
#include <QGroupBox>
#include <QCheckBox>
#include <QRadioButton>
#include <QComboBox>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include <QLineEdit>
#include <QTextEdit>
#include <QPlainTextEdit>
#include <QListWidget>
#include <QTreeWidget>
#include <QTableWidget>
#include <QTabWidget>
#include <QSplitter>
#include <QDockWidget>
#include <QToolBar>
#include <QStatusBar>
#include <QMainWindow>
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
#include <QOpenGLShader>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
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
#include "mindmapnode.h"
#include "filemanager.h"

class MindMapScene;
class MindMapNode;

class MindMapView : public QGraphicsView
{
    Q_OBJECT

public:
    explicit MindMapView(QWidget *parent = nullptr);
    ~MindMapView();

    // View management
    void setScene(MindMapScene *scene);
    MindMapScene* getScene() const { return m_scene; }

    // Zoom and pan
    void setZoom(qreal zoom);
    qreal getZoom() const { return m_zoom; }
    void zoomIn();
    void zoomOut();
    void resetZoom();
    void centerOnContent();
    void fitInView();

    // Pan mode
    void setPanMode(bool enabled);
    bool isPanMode() const { return m_panMode; }

    // Selection mode
    void setSelectionMode(bool enabled);
    bool isSelectionMode() const { return m_selectionMode; }

    // Viewport management
    void setViewportBackground(const QColor &color);
    QColor getViewportBackground() const { return m_viewportBackground; }

    // Grid
    void setGridVisible(bool visible);
    bool isGridVisible() const { return m_gridVisible; }
    void setGridSize(int size);
    int getGridSize() const { return m_gridSize; }
    void setGridColor(const QColor &color);
    QColor getGridColor() const { return m_gridColor; }

    // Performance
    void setAntialiasing(bool enabled);
    bool isAntialiasing() const { return m_antialiasing; }
    void setOpenGLRendering(bool enabled);
    bool isOpenGLRendering() const { return m_openGLRendering; }

    // Export
    void exportToImage(const QString &filePath);
    void exportToPdf(const QString &filePath);
    void exportToSvg(const QString &filePath);

signals:
    void zoomChanged(qreal zoom);
    void viewportChanged();
    void nodeClicked(MindMapNode *node);
    void nodeDoubleClicked(MindMapNode *node);
    void contextMenuRequested(const QPoint &pos);

protected:
    // Mouse events
    void mousePressEvent(QMouseEvent *event) override;
    void mouseMoveEvent(QMouseEvent *event) override;
    void mouseReleaseEvent(QMouseEvent *event) override;
    void mouseDoubleClickEvent(QMouseEvent *event) override;
    void wheelEvent(QWheelEvent *event) override;

    // Key events
    void keyPressEvent(QKeyEvent *event) override;
    void keyReleaseEvent(QKeyEvent *event) override;

    // Paint events
    void paintEvent(QPaintEvent *event) override;
    void drawBackground(QPainter *painter, const QRectF &rect) override;
    void drawForeground(QPainter *painter, const QRectF &rect) override;

    // Resize events
    void resizeEvent(QResizeEvent *event) override;

    // Context menu
    void contextMenuEvent(QContextMenuEvent *event) override;

private slots:
    void onSceneChanged();
    void onViewportChanged();
    void onZoomAnimationFinished();

private:
    // Scene reference
    MindMapScene *m_scene;

    // View state
    qreal m_zoom;
    bool m_panMode;
    bool m_selectionMode;
    bool m_ctrlPressed;
    bool m_shiftPressed;
    bool m_middleButtonPressed;

    // Pan state
    QPointF m_panStart;
    QPointF m_panOffset;
    bool m_panning;

    // Selection state
    QPointF m_selectionStart;
    QRectF m_selectionRect;
    bool m_selecting;

    // Visual properties
    QColor m_viewportBackground;
    bool m_gridVisible;
    int m_gridSize;
    QColor m_gridColor;
    bool m_antialiasing;
    bool m_openGLRendering;

    // Animations
    QPropertyAnimation *m_zoomAnimation;
    QPropertyAnimation *m_panAnimation;

    // Performance
    QTimer *m_updateTimer;
    bool m_updatePending;

    // Methods
    void setupView();
    void setupAnimations();
    void setupPerformance();
    void updateTransform();
    void updateViewport();
    void drawGrid(QPainter *painter, const QRectF &rect);
    void drawSelectionRect(QPainter *painter);
    void handleZoom(const QPointF &center, qreal factor);
    void handlePan(const QPointF &delta);
    void handleSelection(const QPointF &start, const QPointF &end);
    QPointF mapToScene(const QPoint &pos) const;
    QPoint mapFromScene(const QPointF &pos) const;
    QRectF getVisibleRect() const;
    void ensureVisible(const QRectF &rect);
    void centerOn(const QPointF &pos);
    void fitInView(const QRectF &rect);
    void scaleView(qreal scaleFactor);
    void translateView(const QPointF &delta);
    void updateScrollBars();
    void updateRenderingHints();
    void setupOpenGL();
    void cleanupOpenGL();

    // Constants
    static const qreal DEFAULT_ZOOM = 1.0;
    static const qreal MIN_ZOOM = 0.1;
    static const qreal MAX_ZOOM = 10.0;
    static const qreal ZOOM_STEP = 0.1;
    static const qreal ZOOM_FACTOR = 1.15;
    static const int GRID_SIZE = 20;
    static const int UPDATE_INTERVAL = 16; // ~60 FPS
    static const int ANIMATION_DURATION = 250;
};

#endif // MINDMAPVIEW_H
