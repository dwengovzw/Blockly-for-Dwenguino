/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dwenguinoblocklyarduinoplugin;

import java.awt.BorderLayout;
import java.awt.Dimension;
import javafx.application.Platform;
import javafx.concurrent.Task;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javax.swing.JApplet;
import processing.app.Editor;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

/**
 *
 * @author Tom
 */
public class StartupApplet extends JApplet {

    private JFXPanel fxContainer;
    private final int JFXPANEL_WIDTH_INT = 1100;
    private final int JFXPANEL_HEIGHT_INT = 700;
    private Editor editor;
    private Thread activeThread;
    private Browser browser;

    public StartupApplet(Editor editor){
        this.editor = editor;
    }
    
    @Override
    public void init() {
        DwenguinoBlocklyArduinoPlugin.startTimestamp = System.currentTimeMillis();
        fxContainer = new JFXPanel();
        fxContainer.setPreferredSize(new Dimension(JFXPANEL_WIDTH_INT, JFXPANEL_HEIGHT_INT));
        add(fxContainer, BorderLayout.CENTER);
        // create JavaFX scene
        /*Task<Void> task = new Task<Void>() {
            @Override protected Void call() throws Exception {
                createScene();
                return null;
            }
        };
        activeThread = new Thread(task);
        activeThread.start();*/
        Runnable activeRunnable = new Runnable() {

            @Override
            public void run() {
                createScene();
            }
        };
        Platform.setImplicitExit(false);
        Platform.runLater(activeRunnable);
    }

    private void createScene() {
        browser = new Browser(editor);
        fxContainer.setScene(new Scene(browser, 750, 500, Color.web("#666970")));
    }
    
    public void stop(){
        Platform.runLater(() -> {
            browser.webEngine.load(null);
            fxContainer.removeNotify();
        });
        
    }

}
