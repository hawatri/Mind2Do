#ifndef MINDMAPNODE_H
#define MINDMAPNODE_H

#include <QGraphicsItem>
#include <QGraphicsTextItem>
#include <QGraphicsRectItem>
#include <QGraphicsProxyWidget>
#include <QTextEdit>
#include <QLineEdit>
#include <QCheckBox>
#include <QPushButton>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QFrame>
#include <QLabel>
#include <QList>
#include <QString>
#include <QPointF>
#include <QColor>
#include <QFont>
#include <QPen>
#include <QBrush>
#include <QPainter>
#include <QStyleOptionGraphicsItem>
#include <QWidget>
#include <QPropertyAnimation>
#include <QGraphicsDropShadowEffect>
#include <QGraphicsOpacityEffect>
#include <QTimer>
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

class MindMapScene;
class FileManager;

struct MediaFile {
    QString id;
    QString name;
    QString filePath;
    QString type; // "image" or "document"
    qint64 size;
    qint64 lastModified;
    QPixmap thumbnail;
};

struct TextFormatting {
    bool bold = false;
    bool italic = false;
    bool underline = false;
    bool strikethrough = false;
    QString highlightColor = "none";
    QString textColor = "default";
};

class MindMapNode : public QGraphicsItem
{
    Q_OBJECT
    Q_INTERFACES(QGraphicsItem)

public:
    explicit MindMapNode(MindMapScene *scene, const QString &id = QString());
    ~MindMapNode();

    // QGraphicsItem interface
    QRectF boundingRect() const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget = nullptr) override;
    QPainterPath shape() const override;

    // Node properties
    QString getId() const { return m_id; }
    QString getTitle() const { return m_title; }
    QString getDescription() const { return m_description; }
    QPointF getPosition() const { return pos(); }
    bool isCompleted() const { return m_completed; }
    TextFormatting getFormatting() const { return m_formatting; }
    QList<MediaFile> getMediaFiles() const { return m_mediaFiles; }
    QStringList getChildren() const { return m_children; }
    QStringList getConnections() const { return m_connections; }
    QString getParentId() const { return m_parentId; }

    // Node setters
    void setTitle(const QString &title);
    void setDescription(const QString &description);
    void setCompleted(bool completed);
    void setFormatting(const TextFormatting &formatting);
    void setParentId(const QString &parentId);
    void addChild(const QString &childId);
    void removeChild(const QString &childId);
    void addConnection(const QString &connectionId);
    void removeConnection(const QString &connectionId);

    // Media management
    void addMediaFile(const MediaFile &media);
    void removeMediaFile(const QString &mediaId);
    void openMediaFile(const QString &mediaId);

    // Visual properties
    void setSelected(bool selected);
    bool isSelected() const { return m_selected; }
    void setMultiSelected(bool multiSelected);
    bool isMultiSelected() const { return m_multiSelected; }

    // Node operations
    void createChildNode();
    void deleteNode();

protected:
    // Mouse events
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseMoveEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event) override;
    void mouseDoubleClickEvent(QGraphicsSceneMouseEvent *event) override;

    // Hover events
    void hoverEnterEvent(QGraphicsSceneHoverEvent *event) override;
    void hoverLeaveEvent(QGraphicsSceneHoverEvent *event) override;

    // Context menu
    void contextMenuEvent(QGraphicsSceneContextMenuEvent *event) override;

private slots:
    void onTitleEditingFinished();
    void onDescriptionEditingFinished();
    void onCheckBoxToggled(bool checked);
    void onAddMediaClicked();
    void onRemoveMediaClicked();
    void onOpenMediaClicked();
    void onFormatText();
    void onHighlightText();
    void onTextColorChanged();

private:
    // Core properties
    QString m_id;
    QString m_title;
    QString m_description;
    bool m_completed;
    TextFormatting m_formatting;
    QList<MediaFile> m_mediaFiles;
    QStringList m_children;
    QStringList m_connections;
    QString m_parentId;

    // Visual state
    bool m_selected;
    bool m_multiSelected;
    bool m_hovered;
    bool m_dragging;
    QPointF m_dragOffset;

    // UI elements
    QGraphicsProxyWidget *m_titleEditProxy;
    QGraphicsProxyWidget *m_descriptionEditProxy;
    QGraphicsProxyWidget *m_checkBoxProxy;
    QGraphicsProxyWidget *m_addButtonProxy;
    QGraphicsProxyWidget *m_formattingWidgetProxy;
    QGraphicsProxyWidget *m_mediaWidgetProxy;

    // Widgets
    QLineEdit *m_titleEdit;
    QTextEdit *m_descriptionEdit;
    QCheckBox *m_checkBox;
    QPushButton *m_addButton;
    QWidget *m_formattingWidget;
    QWidget *m_mediaWidget;

    // Scene reference
    MindMapScene *m_scene;

    // File manager
    FileManager *m_fileManager;

    // Visual properties
    QRectF m_boundingRect;
    QColor m_backgroundColor;
    QColor m_borderColor;
    QColor m_textColor;
    QFont m_titleFont;
    QFont m_descriptionFont;
    int m_cornerRadius;
    int m_borderWidth;
    int m_padding;

    // Methods
    void setupUI();
    void updateVisualProperties();
    void updateBoundingRect();
    void createFormattingWidget();
    void createMediaWidget();
    void updateMediaWidget();
    QColor getHighlightColor() const;
    QColor getTextColor() const;
    QFont getFormattedFont(const QFont &baseFont) const;
    void applyTextFormatting(QTextEdit *textEdit);
    void openFileWithDefaultApplication(const QString &filePath);
    void showMediaContextMenu(const QPoint &pos, const QString &mediaId);

    // Constants
    static const int DEFAULT_WIDTH = 300;
    static const int DEFAULT_HEIGHT = 200;
    static const int MIN_WIDTH = 200;
    static const int MIN_HEIGHT = 150;
    static const int CORNER_RADIUS = 8;
    static const int BORDER_WIDTH = 2;
    static const int PADDING = 16;
};

#endif // MINDMAPNODE_H
