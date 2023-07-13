/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {createRef, Ref, ref} from 'lit/directives/ref.js';
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { localized, msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { marked } from "marked";
import * as DOMPurify from 'dompurify';
import { githubMarkdownStyle } from "../../styles/github_md";

@localized()
@customElement("dwengo-md-editor")
class BlocklydownEditor extends LitElement {

    @property({type: String}) base_url: string = ""
    @property({type: String}) language: string = "nl"
    render() {
        return html`
        <html>
        <head>
            <title>dwengo IDE</title>
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/all.css" rel="stylesheet">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/style.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/colors.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/jquery-ui/jquery-ui.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/bootstrap.min.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/bootstrap-grid.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/bootstrap-reboot.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/prettify.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/hopscotch.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/jquery.contextMenu.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/tutorials.css">
            <link rel="stylesheet" href="${this.base_url}/dwenguinoblockly/DwenguinoIDE/css/auto-complete.css">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
        </head>
        <body id="db_body">
            <div class="db_header">
                <span class="db_logo">
                    <a href="https://www.dwengo.org" target="_blank"><img id="db_dwengo_logo_top_left" src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/img/dwengo_logo.png" alt="The dwengo logo" /></a>
                </span>
                |
                <span class="environment_settings">
                    <span id="switch_code_view">
                        <span id="switch_to_blockly">Blockly</span>
                        <label class="code-switch">
                            <input id="code_checkbox" type="checkbox">
                            <span class="code-slider round"></span>
                        </label>
                        <span id="switch_to_code">Code</span>
                    </span>
                </span>
                <span id="db_menu_saved_notification">
                    <!-- The application uses this span to show information about the saved status of the program -->
                </span>
                <span class="db_menu">  <!-- ALERT! Do not put whitespace between these divs or they wil appear under eachother on the page! -->
                    <span id="db_menu_item_login_menu" class="db_menu_item" alt="Login menu"><dwengo-login-menu id="dwengo_login_menu" style="display:inline-block"></dwengo-login-menu></span>
                    <span id="db_menu_item_simulator" class="db_menu_item fas fa-tachometer-alt" alt="Open or close simulator"></span>
                    <span id="db_menu_item_save" class="db_menu_item fas fa-save" alt="Save current program to profile." /></span>
                    <span id="db_menu_item_download" class="db_menu_item fas fa-download" alt="Download blocks to file" /></span>
                    <span id="db_menu_item_upload" class="db_menu_item fas fa-upload" alt="Upload blocks to file" /></span>
                    <span id="db_menu_item_loading_gear" class="db_menu_item" alt="Loading gear" style="display:none"><img id="db_menu_item_loading_gear_image" src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/img/gear_animation.gif" alt="Spinning gear icon" /></span>
                    <span id="db_menu_item_run" class="db_menu_item fas fa-play-circle" alt="Upload code to Dwenguino board" /></span>
                    <span id="db_menu_item_clear" class="db_menu_item fas fa-times-circle" alt="Upload empty sketch" /></span>
                    <span id="db_menu_item_language" alt="Dropdown menu to select language">
                        <select name="language" id="db_menu_item_language_selection">
                        </select>
                    </span>
                </span>
            </div>
            <div id="db_main_content" class="db_content resize-container">
                <div id="db_blockly" class="resize-drag">
                    <div id="db_code_pane"></div>
                </div>
                <div id="db_infopane">
                    <div id="db_simulator_panes"></div>
                </div>
                <div id="cookie-consent"> 
                </div>
            </div>
        
            <!--Blockly is injected into the following div, therafter it is positioned over the db_blockly div -->
            <div id="blocklyDiv" style="position: absolute">
            </div>
        
            <div id="startBlocks" style="display: none"><%- blocks_xml %></div>
        
            <xml id="toolbox" style="display: none">
                <category id="catLogic" colour="0" name='Logic'>
                    <block type="controls_if"></block>
                </category>
            </xml>
        
            <div id="dropzoneModal" class="modal fade" role="dialog">
                <div id="modalDialog" class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <div class="message"></div>
                        </div>
                        <div class="modal-footer">
                            <button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        
            <div id="saveToProfileModal" class="modal fade" role="dialog">
                <div id="modalDialog" class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <div class="message"></div>
                            <div class="filename"><input id="filename" type="text"></input></div>
                        </div>
                        <div class="modal-footer">
                            <button id="submit_save_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        
            <div id="notificationModal" class="modal fade" role="dialog">
                <div id="modalDialog" class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <div class="message"></div>
                        </div>
                        <div class="modal-footer">
                            <button id="notification_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        
            <!-- Modal dialog to show error information-->
            <div id="errorModal" class="modal fade" role="dialog">
                    <div class="modal-dialog"><!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                            Error
                            </div>
                            <div class="modal-body">
                                <div class="message"></div>
                                <button class="error_details"><span class="fas fa-terminal"></span></button>
                                <div class="console"></div>
                            </div>
                            <div class="modal-footer">
                            <button id="submit_modal_error_dialog" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>
                            </div>
                        </div>
                    </div>
            </div>
        
        
            <div id="tutorialModal" class="modal fade" role="dialog">
                <div class="modal-dialog"><!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <div class="message"></div>
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        
            <div id="cookiesModal" class="modal fade" role="dialog">
                <div class="modal-dialog"><!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <div class="message"></div>
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        
            <div id="arduinoWarningModal" class="modal fade" role="dialog">
                <div class="modal-dialog"><!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <div class="message"></div>
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        
            <!-- set base path for front end application-->
            <script>
                let settings = {
                    basepath: "${this.base_url}/dwenguinoblockly/",
                    hostname: "${this.base_url}"
                }
            </script>
            <!--<script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/src/settings.js"></script>-->
        
            <!-- import jquery -->
        
        
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/jquery/jquery-3.1.1.min.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/jquery-ui/jquery-ui.js"></script>
        
            <!-- Import translation fallback file, needs to be loaded before Blockly and DwenguinoBlockly -->
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/msg/fallback.js"></script>
        
            <script src="${this.base_url}/dwenguinoblockly/blockly/blockly_uncompressed.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/msg/messages.js"></script>
        
            <!--<script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/src/language_select.js"></script>-->
        
            <script> 
                // Load the Code demo's language strings.
                document.write('<script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/msg/${this.language}.js"></script>\n');
                // Load Blockly's language strings.
                document.write('<script src="${this.base_url}/dwenguinoblockly/blockly/msg/js/${this.language}.js"></script>\n');
            </script>
            <!-- Custom components -->
            <script type="text/javascript" src="${this.base_url}/dashboard/assets/js/serial-monitor.js"></script>
        
            <script>
                let globalSettings = {
                    basepath: "${this.base_url}/dwenguinoblockly/",
                    loggedIn: "<%- loggedIn -%>",
                    hostname: "${this.base_url}",
                    savedProgramUUID: "<%= (typeof savedProgramUUID !== 'undefined') ? savedProgramUUID : undefined %>",
                    editorState: <%- (typeof editorState !== 'undefined') ? editorState : undefined %>
                }
            </script>
            <script type="text/javascript" src="${this.base_url}/dwenguinoblockly/dashboards/js/dist/dashboards.bundle.js"></script>
        
            <!--Scripts for step by step tutorials -->
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/hopscotch.js"></script>
        
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python.js"></script>
        
            <!-- Blockly block definitions -->
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/logic.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/loops.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/math.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/text.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/lists.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/colour.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/variables.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/procedures.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/dwenguino_new.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/input.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/output_actuators.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/arduino.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/comments.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/drawingrobot.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/blocks/conveyor.js"></script>
        
        
            <!-- Blockly translators to c++ code -->
        
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/logic.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/loops.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/math.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/text.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/variables.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/procedures.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/dwenguino.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/input.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/output_actuators.js"></script>
            <!--<script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/arduino.js"></script>-->
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/comments.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/base.js"></script> 
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/arduino.js"></script> 
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/arduino/conveyor.js"></script>
        
            <!-- Blockly ranslators to javascript code -->
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/logic.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/loops.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/math.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/text.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/variables.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/procedures.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/dwenguino.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/input.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/output_actuators.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/comments.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/drawingrobot.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/javascript/conveyor.js"></script>
        
            <!-- Blockly translators to python code -->
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/logic.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/loops.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/math.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/text.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/variables.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/procedures.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/blockly/generators/python/dwenguino.js"></script>
            <!-- extra javascript libs -->
        
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/jquery-ui/jquery-ui.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/prettify.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/diff.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/jquery.contextMenu.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/auto-complete.js"></script>
            <!-- Matter -->
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/matterjs/matter.js"></script>
        
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/nerdamer/nerdamer.core.js"></script> <!-- assuming you've saved the file in the root of course -->
            <!-- LOAD ADD-ONS -->
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/nerdamer/Algebra.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/nerdamer/Calculus.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/nerdamer/Solve.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/nerdamer/Extra.js"></script> <!-- again assuming you've saved the files in root -->
        
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/ResizeSensor.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/ElementQueries.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/debugjs.js" type="text/javascript"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/socket.io.js"></script>
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/lib/dropzone.js"></script>
        
            <!-- DwenguinoBlockly core modules, in the future should be reduced to only the DwenguinoBlockly.js file -->
            <script src="${this.base_url}/dwenguinoblockly/DwenguinoIDE/js/dist/dwenguinoblockly.bundle.js"></script>
        
            </body>
            </html>
        
        `
    }
}