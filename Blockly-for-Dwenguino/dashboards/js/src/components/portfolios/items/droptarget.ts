/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { TextItemInfo } from "../../../state/features/portfolio_slice";

@customElement("dwengo-drop-target")
class DropTarget extends connect(store)(LitElement) {
    @property({type: Number}) index: number = 0
    @state() over: boolean = false

    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <div class="drop_target ${this.over ? "over" : ""}"
                @dragleave=${e => {
                    this.over = false
                    console.log("Leave");
                }}
                @dragover=${e => {
                    e.preventDefault()
                    return false
                }}
                @dragenter=${e => {
                    this.over = true
                    console.log("Enter");
                }}
                @drop=${e => {
                    console.log("Drop!");
                    e.preventDefault()
                    e.stopPropagation()
                    let toIndex = this.index
                    let fromIndex = JSON.parse(e.dataTransfer.getData("text/plain"))
                    this.dispatchEvent(new CustomEvent("orderchanged", {
                        detail: {
                            fromIndex: fromIndex,
                            toIndex: toIndex
                        },
                        bubbles: true,
                        composed: true
                    }))
                    this.over = false;
                    return false
                }}>
                
            </div>
        `
    }


    static styles?: CSSResultGroup = css`
        :host {
            display: flex;
            align-items: center;
        }
        .drop_target.over{
            min-height: 50px;
            transition: min-height 0.15s ease-out; 
            background-color: var(--theme-neutralFocusInnerAccent);
            border-radius: 0.5rem;
        }
        .drop_target {
            min-height: 20px;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .drop_icon {

        }
    `
}