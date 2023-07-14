/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { store } from "../../state/store"
import "../../../../../dashboards/js/src/components/user/login"
import { getGoogleMaterialIconsFilledLinkTag, getGoogleMateriaIconsLinkTag } from "../../../../../dashboards/js/src/util";

import "../../../../../dashboards/js/src/components/util/dwengo_switch"

import Switch from "../../../../../dashboards/js/src/components/util/dwengo_switch";
import { EDITOR_VIEWS, compileCode, compileCurrentCode, downloadCode, setView } from "../../state/features/editor_state_slice";


@customElement("dwengo-editor-menu")
class PortfolioItem extends connect(store)(LitElement) {
    @property() editorState = store.getState().editorState

    handleViewChange(e: CustomEvent) {
      if ((e.target as Switch).checked) {
        if (confirm("Opgepast! Wanneer je naar tekstuele code overstapt dan kan je je programma niet meer simuleren in de browser. Je kan de code dan enkel nog uitvoeren op het Dwenguino bord.")){
          store.dispatch(setView(EDITOR_VIEWS.TEXT))
            // Turn off simulator
          /*if (DwenguinoBlockly.simulatorState !== "off"){
            DwenguinoBlockly.toggleSimulator();
            $("#db_menu_item_simulator").css("pointer-events","none");
          }
          DwenguinoBlockly.currentProgrammingContext = "text";
          document.getElementById("blocklyDiv").style.visibility = 'hidden';
          document.getElementById('db_code_pane').style.visibility = 'visible';
          let code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
          DwenguinoBlockly.textualEditor.getEditorPane().openTab(code, "blocks.cpp");*/
        } else {
          e.detail.sourceEvent.target.checked = false;
          store.dispatch(setView(EDITOR_VIEWS.BLOCKS))
          return false;
        }
      } else {
        store.dispatch(setView(EDITOR_VIEWS.BLOCKS))
        /*DwenguinoBlockly.currentProgrammingContext = "blocks";
        document.getElementById("blocklyDiv").style.visibility = 'visible';
        document.getElementById('db_code_pane').style.visibility = 'hidden';
        DwenguinoBlockly.textualEditor.looseFocus();*/
        // Turn simulator on
        /*if (DwenguinoBlockly.simulatorState === "off"){
          DwenguinoBlockly.toggleSimulator();
          $("#db_menu_item_simulator").css("pointer-events","auto");
        }*/
      }
    }

    handleUploadEmptyProgram() {
      
    }

    handleCompile() {
      store.dispatch(compileCurrentCode())
    }

    handleUpload() {
    }
    handleDownload() {
      store.dispatch(downloadCode())
    }
    handleSave() {

    }
    handleToggleSimulator() {
    }

    protected render() {
        return html`
        ${getGoogleMaterialIconsFilledLinkTag()}
        <div class="db_header">
         <div class="db_header_left">
            <a class="db_logo" href="https://www.dwengo.org" target="_blank"><img class="db_dwengo_logo_top_left" src="${globalSettings.hostname}/dwenguinoblockly/DwenguinoIDE/img/dwengo_logo.png" alt="The dwengo logo"></img></a>
            <span class="environment_settings">
                <span id="switch_code_view">
                    <span id="switch_to_blockly switch_code_view_item">Blockly</span>
                     <dwengo-switch
                      @change=${this.handleViewChange}
                    ></dwengo-switch>
                    <span id="switch_to_code switch_code_view_item">C++</span>
                </span>
            </span>

            <span id="db_menu_saved_notification">
                <!-- The application uses this span to show information about the saved status of the program -->
            </span>
          </div>
          <div class="db_menu">  <!-- ALERT! Do not put whitespace between these divs or they wil appear under eachother on the page! -->
            <span id="db_menu_item_language" alt="Dropdown menu to select language">
                <select name="language" id="db_menu_item_language_selection">
                </select>
            </span>
            <span id="db_menu_item_clear" class="db_menu_item material-symbols-outlined" alt="Upload empty sketch.">
              cancel
            </span>
            <span id="db_menu_item_run" class="db_menu_item material-symbols-outlined" alt="Upload code to Dwenguino board."
              @click=${this.handleCompile}>
              play_circle
            </span>
            <span id="db_menu_item_loading_gear" class="db_menu_item" alt="Loading gear" style="display:none"><img id="db_menu_item_loading_gear_image" src="<%- base_url -%>/dwenguinoblockly/DwenguinoIDE/img/gear_animation.gif" alt="Spinning gear icon" /></span>
            <span id="db_menu_item_upload" class="db_menu_item material-symbols-outlined" alt="Upload blocks from a file.">
              upload
            </span>
            <span id="db_menu_item_download" class="db_menu_item material-symbols-outlined" alt="Download blocks to a file."
              @click=${this.handleDownload}>
              download
            </span>
            <span id="db_menu_item_save" class="db_menu_item material-symbols-outlined" alt="Save current program to your profile.">
              save
            </span>
            <span id="db_menu_item_simulator" class="db_menu_item material-symbols-outlined" alt="Open or close simulator">
              speed
            </span>
            <span id="db_menu_item_login_menu" class="db_menu_item" alt="Login menu">
              <dwengo-login-menu id="dwengo_login_menu" style="display:inline-block"></dwengo-login-menu>
            </span> 
          </div>
      </div>
        `
    }

    static styles?: CSSResultGroup = [css`
    .db_header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 55px;
      border-bottom: solid var(--theme-accentFillSelected, #6DA037) 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .db_header_left {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
    }
    .db_logo {
      box-sizing: border-box;
    }
    .db_dwengo_logo_top_left {
      max-width: 100px;
      max-height: 100%;
      overflow: hidden;
    }
    .db_menu{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
        box-sizing: border-box;
        margin-right: 0;
        height: 100%;
    }
    .db_menu_item{
      padding: 10px;
      font-size: 1.9rem;
      line-height: 1;
    }
    .db_menu_item:hover{
      color: var(--theme-accentFillSelected, #6DA037);
      cursor: pointer;
    }
    .db_diff_icon{
      font-size: 20px;
      padding: 15px;
  }

  #switch_code_view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  dwengo-switch {
    margin: 0 10px;
  }
  
  #db_menu_item_language_selection{
      /* width: 200px; */
      margin: 10.5px 0;
      background-color: #ffffff;
      border: 1px #8bab42 solid;
      font-family: Roboto, sans-serif;
      font-weight: 300;
  }
  
  #db_menu_item_language{
      float: right;
  }
  
  #db_menu_item_language_selection option{
      font-size: 20px;
  }

  .material-symbols-outlined {
    font-variation-settings:
    'FILL' 1,
    'wght' 700,
    'GRAD' 0,
    'opsz' 48
  }

        `]

}