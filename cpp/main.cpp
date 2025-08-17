#include "mainwindow.h"

#include <QApplication>
#include <QStyleFactory>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    
    // Set application properties
    a.setApplicationName("Mind2Do");
    a.setApplicationVersion("1.0.0");
    a.setOrganizationName("Mind2Do");
    a.setOrganizationDomain("mind2do.com");
    
    // Set application style
    a.setStyle(QStyleFactory::create("Fusion"));
    
    // Create and show main window
    MainWindow w;
    w.show();
    
    return a.exec();
}
