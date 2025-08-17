QT += core gui widgets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    main.cpp \
    mainwindow.cpp \
    mindmapnode.cpp \
    mindmapscene.cpp \
    mindmapview.cpp \
    filemanager.cpp \
    documentviewer.cpp \
    formattingtoolbar.cpp \
    connectiontoolbar.cpp \
    fileoperations.cpp

HEADERS += \
    mainwindow.h \
    mindmapnode.h \
    mindmapscene.h \
    mindmapview.h \
    filemanager.h \
    documentviewer.h \
    formattingtoolbar.h \
    connectiontoolbar.h \
    fileoperations.h

FORMS += \
    mainwindow.ui \
    documentviewer.ui \
    formattingtoolbar.ui \
    connectiontoolbar.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

# Include resources
RESOURCES += \
    resources.qrc
