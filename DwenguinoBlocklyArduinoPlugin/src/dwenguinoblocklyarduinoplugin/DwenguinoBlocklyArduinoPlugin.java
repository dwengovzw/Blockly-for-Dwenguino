/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dwenguinoblocklyarduinoplugin;

import javax.swing.JApplet;
import javax.swing.JFrame;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;

import processing.app.tools.Tool;
import processing.app.Editor;

/**
 *
 * @author Tom
 */
public class DwenguinoBlocklyArduinoPlugin implements Tool {

    public static Editor editor;

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        DwenguinoBlocklyArduinoPlugin.startApplication();
    }
    
    public static void startApplication(){
        SwingUtilities.invokeLater(new Runnable() {

            @Override
            public void run() {
                try {
                    UIManager.setLookAndFeel("com.sun.java.swing.plaf.nimbus.NimbusLookAndFeel");
                } catch (Exception e) {
                }

                JFrame frame = new JFrame("DwenguinoBlockly");
                frame.setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);

                JApplet applet = new StartupApplet(editor);
                applet.init();

                frame.setContentPane(applet.getContentPane());

                frame.pack();
                frame.setLocationRelativeTo(null);
                frame.setVisible(true);

                applet.start();
            }
        });
    }

  

    @Override
    public void run() {

    DwenguinoBlocklyArduinoPlugin.editor.toFront();
    // Fill in author.name, author.url, tool.prettyVersion and
        // project.prettyName in build.properties for them to be auto-replaced here.
        DwenguinoBlocklyArduinoPlugin.startApplication();
    }

    @Override
    public String getMenuTitle() {
        return "DwenguinoBlockly";
    }

    @Override
    public void init(Editor editor) {
        DwenguinoBlocklyArduinoPlugin.editor = editor;
    }

}
