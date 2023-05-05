/**
 * @author Tom Neutens tomneutens@gmail.com
 */

import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import {customElement, property, state, query} from 'lit/decorators.js';
import { msg } from "@lit/localize";

import { LitMoveable } from "lit-moveable";

@customElement("dwengo-moveable-item")
class MoveableItem extends LitElement {
    @property({type: Number}) x = 10
    @property({type: Number}) y = 20
    @property({type: Number}) width = 100
    @property({type: Number}) height = 100



    @query(".target")
    target!: HTMLElement

    @state() rerender = false // this is a hack to force a rerender of the moveable element

    translation = [0, 0]

    constructor(){
        super()
        if (customElements.get("lit-moveable") == undefined){
            customElements.define("lit-moveable", LitMoveable)
        }
    }

    connectedCallback(): void {
        super.connectedCallback()
        setTimeout(() => {
            this.rerender = true
        }
        , 0);
    }

    onDrag(e) {
        e.detail.target.style.transform = e.detail.transform;
    }

    onResize(e) {
        const beforeTranslate = e.detail.drag.beforeTranslate
        e.detail.target.style.width = `${e.detail.width}px`
        e.detail.target.style.height = `${e.detail.height}px`
        e.detail.target.style.transform = e.detail.drag.transform
    }
    onScroll({ scrollContainer, direction }) {
        scrollContainer.scrollBy(direction[0] * 10, direction[1] * 10);
   }

    render() {
        return html`
            <div class="target"
                    style=${`display:inline-block;width:${this.width}px;height:${this.height}px;transform: translate(${this.x}px, ${this.y}px)`}   >
                    <slot></slot>
            </div>
            <lit-moveable
                .target=${this.target}
                .litDraggable=${true}
                .resizable=${true}
                .edgeDraggable=${true}
                .edge=${["n"]}
                .zoom=${0.5}
                @litDrag=${this.onDrag}
                @litResize=${this.onResize}
            }}
            ></lit-moveable>
        `
    }

        
        static styles: CSSResultGroup = css`
            :host {
                position: absolute;
                display: inline-block;
                border: 1px solid rgb(204, 204, 204);
            }
            .target {
                position: absolute;
                border: 1px solid var(--theme-accentFillSelected);
                box-sizing: border-box;
                overflow: hidden;
                padding: 5px;
            }

            .moveable-control.moveable-origin {
                border-color: transparent!important;
            }

            .moveable-control.moveable-direction {
                border: none;
                visibility: visible!important;
                background-color: var(--theme-accentFillSelected);
            }     
            
            .moveable-line.moveable-direction {
                background-color: var(--theme-accentFillSelected);
            }
            
            
            `
}