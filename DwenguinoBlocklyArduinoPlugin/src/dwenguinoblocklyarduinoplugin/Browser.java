/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dwenguinoblocklyarduinoplugin;

import java.util.Optional;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker.State;
import javafx.event.EventHandler;
import javafx.geometry.HPos;
import javafx.geometry.VPos;
import javafx.scene.Node;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.web.PromptData;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import netscape.javascript.JSObject;
import processing.app.Editor;
import javafx.scene.control.TextInputDialog;
import javafx.scene.web.WebEvent;

/**
 *
 * @author Tom
 */
class Browser extends Region {
 
    public final WebView browser = new WebView();
    public final WebEngine webEngine = browser.getEngine();
    public DwenguinoBlocklyServer serverObject;
     
    public Browser(Editor editor) {
        //apply the styles
        getStyleClass().add("browser");
        
        // process page loading
        webEngine.getLoadWorker().stateProperty().addListener(
            new ChangeListener<State>() {
                @Override
                public void changed(ObservableValue<? extends State> ov,
                    State oldState, State newState) {   
                    if (newState == State.SUCCEEDED) {
                        // The JavaAppp class implements the JavaScript to Java bindings
                        serverObject = new DwenguinoBlocklyServer(editor, Browser.this.getScene().getWindow());
                            JSObject win = 
                                (JSObject) webEngine.executeScript("window");
                                win.setMember("dwenguinoBlocklyServer", serverObject);
                        }
                    }
                }
        );
        
        webEngine.setOnAlert(new EventHandler<WebEvent<String>>() {

            @Override
            public void handle(WebEvent<String> event) {
                Alert alert = new Alert(AlertType.INFORMATION);
                alert.setContentText(event.getData());
                alert.showAndWait();
            }
        });
        
        //Set handler to handle browser promp events
        webEngine.setPromptHandler((PromptData param) -> {
            TextInputDialog prompt = new TextInputDialog();
            prompt.setTitle("DwenguinoBlockly");
            Optional<String> result = prompt.showAndWait();
            return result.orElse("");
            });
        //String baseurl = "file:/" + System.getProperty("user.home");
        String baseurl = "file:" + getClass().getProtectionDomain().getCodeSource().getLocation().getPath();
        baseurl = baseurl.replace("\\", "/");
        baseurl = baseurl.replace("DwenguinoBlocklyArduinoPlugin.jar", "");
        
//        System.out.println("baseurl");
//        System.out.println(baseurl);
//        
//        System.out.println("Loading file:");
//        System.out.println(baseurl + "DwenguinoBlockly/blockly/demos/code/index.html");
        
        webEngine.load(baseurl + "DwenguinoBlockly/blockly/demos/code/index_new.html");
        //webEngine.load(baseurl + "/Documents/Arduino/tools/DwenguinoBlocklyArduinoPlugin/tool/DwenguinoBlockly/blockly/demos/code/index.html");

        //add the web view to the scene
        getChildren().add(browser);
 
    }
    private Node createSpacer() {
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        return spacer;
    }
 
    @Override protected void layoutChildren() {
        double w = getWidth();
        double h = getHeight();
        layoutInArea(browser,0,0,w,h,0, HPos.CENTER, VPos.CENTER);
    }
 
    @Override protected double computePrefWidth(double height) {
        return 750;
    }
 
    @Override protected double computePrefHeight(double width) {
        return 500;
    }
}
