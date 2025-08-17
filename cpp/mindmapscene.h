#ifndef MINDMAPSCENE_H
#define MINDMAPSCENE_H

#include <QGraphicsScene>
#include <QGraphicsView>
#include <QGraphicsItem>
#include <QList>
#include <QMap>
#include <QString>
#include <QPointF>
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

#include "mindmapnode.h"
#include "filemanager.h"

class MindMapView;
class ConnectionLine;

struct MindMapData {
    QString version;
    QString createdAt;
    QString updatedAt;
    QList<MindMapNode*> nodes;
};

class MindMapScene : public QGraphicsScene
{
    Q_OBJECT

public:
    explicit MindMapScene(QObject *parent = nullptr);
    ~MindMapScene();

    // Scene management
    void clearScene();
    void addNode(MindMapNode *node);
    void removeNode(MindMapNode *node);
    MindMapNode* getNode(const QString &id);
    QList<MindMapNode*> getAllNodes() const;
    QList<MindMapNode*> getSelectedNodes() const;
    QList<MindMapNode*> getMultiSelectedNodes() const;

    // Selection management
    void selectNode(MindMapNode *node);
    void deselectNode(MindMapNode *node);
    void clearSelection();
    void multiSelectNode(MindMapNode *node);
    void clearMultiSelection();

    // Connection management
    void createConnection(MindMapNode *fromNode, MindMapNode *toNode);
    void removeConnection(MindMapNode *fromNode, MindMapNode *toNode);
    void updateConnections();
    QList<ConnectionLine*> getConnections() const;

    // Zoom and pan
    void setZoom(qreal zoom);
    qreal getZoom() const { return m_zoom; }
    void centerOnContent();
    void resetZoom();

    // File operations
    void saveMindMap(const QString &filePath);
    void loadMindMap(const QString &filePath);
    void autoSave();
    void exportToImage(const QString &filePath);

    // Node operations
    MindMapNode* createNode(const QString &parentId = QString(), const QPointF &position = QPointF());
    void deleteNode(MindMapNode *node);
    void duplicateNode(MindMapNode *node);

    // View reference
    void setView(MindMapView *view) { m_view = view; }
    MindMapView* getView() const { return m_view; }

    // File manager
    FileManager* getFileManager() const { return m_fileManager; }

signals:
    void nodeSelected(MindMapNode *node);
    void nodeDeselected(MindMapNode *node);
    void nodeCreated(MindMapNode *node);
    void nodeDeleted(MindMapNode *node);
    void nodeMoved(MindMapNode *node, const QPointF &position);
    void connectionCreated(MindMapNode *fromNode, MindMapNode *toNode);
    void connectionRemoved(MindMapNode *fromNode, MindMapNode *toNode);
    void mindMapSaved();
    void mindMapLoaded();
    void autoSaveCompleted();

protected:
    // Scene events
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseMoveEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event) override;
    void keyPressEvent(QKeyEvent *event) override;
    void keyReleaseEvent(QKeyEvent *event) override;

private slots:
    void onAutoSaveTimeout();
    void onNodeSelectionChanged();
    void onNodePositionChanged();

private:
    // Core data
    QMap<QString, MindMapNode*> m_nodes;
    QList<ConnectionLine*> m_connections;
    MindMapView *m_view;
    FileManager *m_fileManager;

    // Selection state
    MindMapNode *m_selectedNode;
    QList<MindMapNode*> m_multiSelectedNodes;
    bool m_ctrlPressed;

    // Zoom and pan
    qreal m_zoom;
    QPointF m_panOffset;
    bool m_panning;
    QPointF m_panStart;

    // Auto-save
    QTimer *m_autoSaveTimer;
    QString m_autoSavePath;

    // Methods
    void setupAutoSave();
    void createDefaultNode();
    void updateNodeConnections();
    void drawConnections();
    void clearConnections();
    QString generateNodeId() const;
    QPointF calculateChildPosition(MindMapNode *parentNode) const;
    void saveNodeToJson(QJsonObject &json, MindMapNode *node);
    MindMapNode* loadNodeFromJson(const QJsonObject &json);
    void saveToSettings();
    void loadFromSettings();
    QString getDefaultSavePath() const;
    void createConnectionLine(MindMapNode *fromNode, MindMapNode *toNode);

    // Constants
    static const int AUTO_SAVE_INTERVAL = 5000; // 5 seconds
    static const qreal DEFAULT_ZOOM = 1.0;
    static const qreal MIN_ZOOM = 0.3;
    static const qreal MAX_ZOOM = 3.0;
    static const qreal ZOOM_STEP = 0.1;
};

// Connection line class
class ConnectionLine : public QGraphicsItem
{
public:
    ConnectionLine(MindMapNode *fromNode, MindMapNode *toNode, QGraphicsItem *parent = nullptr);
    ~ConnectionLine();

    QRectF boundingRect() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget = nullptr) override;
    QPainterPath shape() const override;

    void updatePosition();
    MindMapNode* getFromNode() const { return m_fromNode; }
    MindMapNode* getToNode() const { return m_toNode; }

private:
    MindMapNode *m_fromNode;
    MindMapNode *m_toNode;
    QPointF m_fromPoint;
    QPointF m_toPoint;
    QPen m_pen;
    QBrush m_brush;
    int m_lineWidth;
    QColor m_lineColor;
    Qt::PenStyle m_lineStyle;

    void calculateEndPoints();
    QPointF getNodeConnectionPoint(MindMapNode *node, const QPointF &direction) const;
};

#endif // MINDMAPSCENE_H
