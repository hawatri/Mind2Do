#ifndef FILEMANAGER_H
#define FILEMANAGER_H

#include <QObject>
#include <QString>
#include <QStringList>
#include <QList>
#include <QMap>
#include <QFile>
#include <QFileInfo>
#include <QDir>
#include <QUrl>
#include <QDesktopServices>
#include <QProcess>
#include <QMimeDatabase>
#include <QMimeType>
#include <QImage>
#include <QPixmap>
#include <QBuffer>
#include <QByteArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QSettings>
#include <QStandardPaths>
#include <QDateTime>
#include <QUuid>
#include <QTimer>
#include <QThread>
#include <QMutex>
#include <QWaitCondition>
#include <QFuture>
#include <QFutureWatcher>
#include <QtConcurrent>
#include <QApplication>
#include <QClipboard>
#include <QDrag>
#include <QMimeData>
#include <QDropEvent>
#include <QDragEnterEvent>
#include <QDragMoveEvent>
#include <QDragLeaveEvent>
#include <QMenu>
#include <QAction>
#include <QFileDialog>
#include <QMessageBox>
#include <QProgressDialog>
#include <QInputDialog>
#include <QColorDialog>
#include <QFontDialog>
#include <QPrintDialog>
#include <QPrinter>
#include <QPrintPreviewDialog>
#include <QPageSetupDialog>
#include <QTextDocument>
#include <QTextCursor>
#include <QTextFormat>
#include <QTextCharFormat>
#include <QTextBlockFormat>
#include <QTextList>
#include <QTextTable>
#include <QTextFrame>
#include <QTextDocumentFragment>
#include <QTextDocumentWriter>
#include <QTextCodec>
#include <QTextStream>
#include <QTextBrowser>
#include <QTextEdit>
#include <QPlainTextEdit>
#include <QLineEdit>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include <QSlider>
#include <QProgressBar>
#include <QLabel>
#include <QPushButton>
#include <QCheckBox>
#include <QRadioButton>
#include <QComboBox>
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

#include "mindmapnode.h"

struct FilePath {
    QString id;
    QString path;
    QString name;
    QString type; // "image" or "document"
    qint64 size;
    qint64 lastModified;
};

class FileManager : public QObject
{
    Q_OBJECT

public:
    explicit FileManager(QObject *parent = nullptr);
    ~FileManager();

    // File path management
    void addFilePath(const FilePath &filePath);
    void removeFilePath(const QString &id);
    FilePath getFilePath(const QString &id) const;
    QList<FilePath> getAllFilePaths() const;
    QString getLastOpenedPdf() const { return m_lastOpenedPdf; }
    void setLastOpenedPdf(const QString &path);

    // File operations
    bool openFile(const QString &filePath);
    bool openFileWithDefaultApplication(const QString &filePath);
    bool openPdfFile(const QString &filePath);
    bool openImageFile(const QString &filePath);
    bool openDocumentFile(const QString &filePath);
    bool openLastPdf();

    // File utilities
    QString getFileType(const QString &filePath) const;
    QString getMimeType(const QString &filePath) const;
    qint64 getFileSize(const QString &filePath) const;
    QDateTime getFileLastModified(const QString &filePath) const;
    bool fileExists(const QString &filePath) const;
    QString getFileName(const QString &filePath) const;
    QString getFileExtension(const QString &filePath) const;
    QString getFileDirectory(const QString &filePath) const;
    QString getAbsolutePath(const QString &filePath) const;
    QString getRelativePath(const QString &filePath, const QString &basePath) const;

    // Image operations
    QPixmap loadImage(const QString &filePath) const;
    QPixmap createThumbnail(const QString &filePath, const QSize &size = QSize(100, 100)) const;
    bool saveImage(const QPixmap &pixmap, const QString &filePath) const;
    QByteArray imageToBase64(const QPixmap &pixmap, const QString &format = "PNG") const;
    QPixmap base64ToImage(const QByteArray &base64) const;

    // File dialogs
    QString openFileDialog(const QString &title = "Open File", 
                          const QString &filter = "All Files (*.*)",
                          const QString &defaultDirectory = QString());
    QStringList openFilesDialog(const QString &title = "Open Files",
                               const QString &filter = "All Files (*.*)",
                               const QString &defaultDirectory = QString());
    QString saveFileDialog(const QString &title = "Save File",
                          const QString &filter = "All Files (*.*)",
                          const QString &defaultDirectory = QString(),
                          const QString &defaultName = QString());
    QString selectDirectoryDialog(const QString &title = "Select Directory",
                                 const QString &defaultDirectory = QString());

    // File system operations
    bool copyFile(const QString &sourcePath, const QString &destinationPath) const;
    bool moveFile(const QString &sourcePath, const QString &destinationPath) const;
    bool deleteFile(const QString &filePath) const;
    bool createDirectory(const QString &path) const;
    bool removeDirectory(const QString &path) const;
    QStringList getFilesInDirectory(const QString &path, const QStringList &filters = QStringList()) const;
    QStringList getSubdirectories(const QString &path) const;

    // Settings
    void saveSettings();
    void loadSettings();
    void clearSettings();

    // Utilities
    QString generateUniqueId() const;
    QString sanitizeFileName(const QString &fileName) const;
    QString getHumanReadableFileSize(qint64 bytes) const;
    QString getFileIconPath(const QString &filePath) const;
    bool isImageFile(const QString &filePath) const;
    bool isPdfFile(const QString &filePath) const;
    bool isDocumentFile(const QString &filePath) const;
    bool isVideoFile(const QString &filePath) const;
    bool isAudioFile(const QString &filePath) const;
    bool isArchiveFile(const QString &filePath) const;

signals:
    void fileOpened(const QString &filePath);
    void fileOpenFailed(const QString &filePath, const QString &error);
    void filePathAdded(const FilePath &filePath);
    void filePathRemoved(const QString &id);
    void lastPdfChanged(const QString &path);

private slots:
    void onFileOpenFinished();
    void onFileOpenError();

private:
    // File paths storage
    QList<FilePath> m_filePaths;
    QString m_lastOpenedPdf;

    // Settings
    QSettings *m_settings;

    // File operations
    QMimeDatabase m_mimeDatabase;
    QFutureWatcher<bool> *m_fileOpenWatcher;

    // Methods
    void setupSettings();
    void setupFileWatcher();
    bool openFileInternal(const QString &filePath);
    QString getDefaultApplication(const QString &mimeType) const;
    bool launchApplication(const QString &application, const QString &filePath) const;
    void updateLastOpenedPdf(const QString &filePath);
    QString getSettingsKey(const QString &key) const;
    void setSettingsKey(const QString &key, const QVariant &value);
    QVariant getSettingsValue(const QString &key, const QVariant &defaultValue = QVariant()) const;
    void setSettingsValue(const QString &key, const QVariant &value);

    // Constants
    static const QString SETTINGS_GROUP_FILE_PATHS;
    static const QString SETTINGS_KEY_LAST_PDF;
    static const QString SETTINGS_KEY_FILE_PATHS;
    static const qint64 MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    static const int THUMBNAIL_SIZE = 100;
    static const QStringList IMAGE_EXTENSIONS;
    static const QStringList PDF_EXTENSIONS;
    static const QStringList DOCUMENT_EXTENSIONS;
    static const QStringList VIDEO_EXTENSIONS;
    static const QStringList AUDIO_EXTENSIONS;
    static const QStringList ARCHIVE_EXTENSIONS;
};

#endif // FILEMANAGER_H
