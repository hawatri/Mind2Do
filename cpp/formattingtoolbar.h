#ifndef FORMATTINGTOOLBAR_H
#define FORMATTINGTOOLBAR_H

#include <QWidget>
#include <QToolBar>
#include <QAction>
#include <QPushButton>
#include <QComboBox>
#include <QColorDialog>
#include <QFontDialog>
#include <QButtonGroup>
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QFrame>
#include <QLabel>
#include <QGroupBox>
#include <QCheckBox>
#include <QRadioButton>
#include <QSlider>
#include <QSpinBox>
#include <QDoubleSpinBox>
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

class FormattingToolbar : public QWidget
{
    Q_OBJECT

public:
    explicit FormattingToolbar(QWidget *parent = nullptr);
    ~FormattingToolbar();

    // Formatting management
    void setSelectedNode(MindMapNode *node);
    MindMapNode* getSelectedNode() const { return m_selectedNode; }
    void clearSelection();
    void updateFormatting();

    // Formatting operations
    void setBold(bool bold);
    void setItalic(bool italic);
    void setUnderline(bool underline);
    void setStrikethrough(bool strikethrough);
    void setHighlightColor(const QString &color);
    void setTextColor(const QString &color);

signals:
    void formattingChanged(const TextFormatting &formatting);

private slots:
    void onBoldToggled(bool checked);
    void onItalicToggled(bool checked);
    void onUnderlineToggled(bool checked);
    void onStrikethroughToggled(bool checked);
    void onHighlightColorChanged(const QString &color);
    void onTextColorChanged(const QString &color);
    void onHighlightColorButtonClicked();
    void onTextColorButtonClicked();

private:
    // Core components
    MindMapNode *m_selectedNode;

    // UI components
    QHBoxLayout *m_mainLayout;
    QAction *m_boldAction;
    QAction *m_italicAction;
    QAction *m_underlineAction;
    QAction *m_strikethroughAction;
    QComboBox *m_highlightColorCombo;
    QComboBox *m_textColorCombo;
    QPushButton *m_highlightColorButton;
    QPushButton *m_textColorButton;
    QButtonGroup *m_formattingButtonGroup;

    // Methods
    void setupUI();
    void setupConnections();
    void updateUI();
    void updateFormattingButtons();
    void updateColorCombos();
    void updateColorButtons();
    void applyFormatting();
    QString getHighlightColorName(const QString &color) const;
    QString getTextColorName(const QString &color) const;
    QColor getHighlightColor(const QString &color) const;
    QColor getTextColor(const QString &color) const;
    void setHighlightColorButtonColor(const QString &color);
    void setTextColorButtonColor(const QString &color);

    // Constants
    static const QStringList HIGHLIGHT_COLORS;
    static const QStringList TEXT_COLORS;
    static const QMap<QString, QColor> HIGHLIGHT_COLOR_MAP;
    static const QMap<QString, QColor> TEXT_COLOR_MAP;
};

#endif // FORMATTINGTOOLBAR_H
