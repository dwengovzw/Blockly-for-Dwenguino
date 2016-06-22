/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dwenguinoblocklyarduinoplugin;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import javafx.application.Platform;
import javafx.stage.FileChooser;
import javafx.stage.Window;
import javax.swing.SwingUtilities;
import processing.app.Editor;

/**
 *
 * @author Tom
 */
public class DwenguinoBlocklyServer {

    private String lastOpenedLocation = System.getProperty("user.home");
    private Editor editor;
    private Window ownerWindow;

    
    public DwenguinoBlocklyServer(Editor editor, Window ownerWindow){
        this.editor = editor;
        this.ownerWindow = ownerWindow;
    }
    /**
     * This method is called from javascript. It lets the user select a location
     * where to save the blocks to and saves them.
     *
     * @param xml The xml structure of the created block program.
     */
    public void saveBlocks(String xml) {
        System.out.println(lastOpenedLocation);
        FileChooser fileChooser = new FileChooser();
        fileChooser.setInitialDirectory(new File(lastOpenedLocation));
        fileChooser.setTitle("Save");
        fileChooser.getExtensionFilters().addAll(
                new FileChooser.ExtensionFilter("XML files", "*.xml")
        );
        File selectedFile = fileChooser.showSaveDialog(ownerWindow);
        if (selectedFile != null) {
            lastOpenedLocation = selectedFile.getParent();
            try {
                BufferedWriter bWriter = new BufferedWriter(new FileWriter(selectedFile));
                bWriter.write(xml);
                bWriter.flush();
                bWriter.close();
            } catch (IOException ex) {
                Logger.getLogger(DwenguinoBlocklyServer.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     * This method is called from javascript. It lets the user select a location
     * where to save the generated code to and saves them.
     *
     * @param code The Arduino c code generated from the blocks.
     */
    public void saveCode(String code) {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setInitialDirectory(new File(lastOpenedLocation));
        fileChooser.setTitle("Save");
        fileChooser.getExtensionFilters().addAll(
                new FileChooser.ExtensionFilter("Arduino files", "*.ino", "*.c", "*.cpp")
        );
        File selectedFile = fileChooser.showSaveDialog(ownerWindow);
        if (selectedFile != null) {
            lastOpenedLocation = selectedFile.getParent();
            try {
                BufferedWriter bWriter = new BufferedWriter(new FileWriter(selectedFile));
                bWriter.write(code);
                bWriter.flush();
                bWriter.close();
            } catch (IOException ex) {
                Logger.getLogger(DwenguinoBlocklyServer.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     * Uploads the created code to the dwenguino board.
     *
     * @param code Arduino C code
     */
    public void uploadCode(String code) {

        SwingUtilities.invokeLater(new Runnable() {

            @Override
            public void run() {
                DwenguinoBlocklyArduinoPlugin.editor.setText(code);
        
                System.out.println("handleExport");

                DwenguinoBlocklyArduinoPlugin.editor.handleExport(false);

                System.out.println("Done handling export");
            }
        });
        
        
        
    }

    /**
     * Loads an xml file in which the user saved his blocks.
     *
     * @return xml data for the block structure.
     */
    public String loadBlocks() {
        String blockData = "";
        FileChooser fileChooser = new FileChooser();
        fileChooser.setInitialDirectory(new File(lastOpenedLocation));
        fileChooser.setTitle("Open");
        fileChooser.getExtensionFilters().addAll(
                new FileChooser.ExtensionFilter("XML files", "*.xml")
        );
        File selectedFile = fileChooser.showOpenDialog(ownerWindow);
        if (selectedFile != null) {
            lastOpenedLocation = selectedFile.getParent();
            try {
                BufferedReader fReader = new BufferedReader(new FileReader(selectedFile));
                blockData = fReader.lines().collect(Collectors.joining());
                fReader.close();
            } catch (FileNotFoundException ex) {
                Logger.getLogger(DwenguinoBlocklyServer.class.getName()).log(Level.SEVERE, null, ex);
            } catch (IOException ex) {
                Logger.getLogger(DwenguinoBlocklyServer.class.getName()).log(Level.SEVERE, null, ex);
            }

        }

        return blockData;
    }

    public void discard() {
        System.out.println("Are you sure you want to discard your blocks?");
    }

    public void exit() {
        Platform.exit();
    }
}


