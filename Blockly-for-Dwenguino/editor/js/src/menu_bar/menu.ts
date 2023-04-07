/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';

//import "../../../../dashboards/js/dist/dashboards.bundle.js"

@customElement("dwengo-editor-menu")
class PortfolioItem extends LitElement {
    @property({type: Boolean}) showTextualEditor = false

    protected render() {
        return html`
        <div class="db_header">
          <a class="db_logo" href="https://www.dwengo.org" target="_blank"><img class="db_dwengo_logo_top_left" src="${globalSettings.hostname}/dwenguinoblockly/DwenguinoIDE/img/dwengo_logo.png" alt="The dwengo logo"></img></a>

          |
          <span class="environment_settings">
              <span id="switch_code_view">
                  <span id="switch_to_blockly">Blockly</span>
                  <label class="code-switch">
                      <input 
                          id="code_checkbox" 
                          type="checkbox"
                          @change=${e => {
                              if (e.target.checked) {
                                  if (confirm("Opgepast! Wanneer je naar tekstuele code overstapt dan kan je je programma niet meer simuleren in de browser. Je kan de code dan enkel nog uitvoeren op het Dwenguino bord.")){
                                    this.showTextualEditor = true
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
                                      this.showTextualEditor = false;
                                    return false;
                                  }
                                } else {
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
                              this.dispatchEvent(new CustomEvent('show-textual-editor-changed', { detail: { showTextualEditor: this.showTextualEditor }}))
                          }}>
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
              <span id="db_menu_item_loading_gear" class="db_menu_item" alt="Loading gear" style="display:none"><img id="db_menu_item_loading_gear_image" src="<%- base_url -%>/dwenguinoblockly/DwenguinoIDE/img/gear_animation.gif" alt="Spinning gear icon" /></span>
              <span id="db_menu_item_run" class="db_menu_item fas fa-play-circle" alt="Upload code to Dwenguino board" /></span>
              <span id="db_menu_item_clear" class="db_menu_item fas fa-times-circle" alt="Upload empty sketch" /></span>
              <span id="db_menu_item_language" alt="Dropdown menu to select language">
                  <select name="language" id="db_menu_item_language_selection">
                  </select>
              </span>
          </span>
      </div>
        `
    }

    static styles?: CSSResultGroup = css`
    .db_header {
      position: relative;
      height: 55px;
      border-bottom: solid #8bab42 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
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
        box-sizing: border-box;
        margin-right: 0;
        height: 100%;
    }
    .db_menu_item{
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
      padding-bottom: 10px;
      float: right;
      height: 100%;
      font-size: 1.5rem;
      vertical-align: center;
      font-weight: 600;
    }
    .db_menu_item:hover{
      color: #8bab42;
    }
    .db_diff_icon{
      font-size: 20px;
      padding: 15px;
  }
  
  #db_menu_item_difficulty{
      width: 200px;
      height: 30px;
      padding:10px;
  }
  
  #db_menu_item_difficulty_slider{
      display: inline-block;
      width: 100%;
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
        `

}