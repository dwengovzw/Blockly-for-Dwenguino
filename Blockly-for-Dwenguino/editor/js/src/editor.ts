import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js"; // needs .js to transpile

import "./menu_bar/menu"

// Polyfill URLPattern
import {URLPattern} from "urlpattern-polyfill";
// @ts-ignore: Property 'UrlPattern' does not exist 
globalThis.URLPattern = URLPattern

@customElement("dwengo-editor")
class DwengoEditor extends LitElement {

    createRenderRoot() {
        return this; // turn off shadow dom to access external styles
      }

    protected render() {
        return html`
         <dwengo-editor-menu></dwengo-editor-menu>
                    `
                    
    }

    static styles?: CSSResultGroup = css`
        
        :host {
            display: flex;
            flex-direction: row;
            align-items: stretch;
        }
        
    `
}


export default DwengoEditor