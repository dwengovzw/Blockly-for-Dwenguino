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

    translation = [0, 0]

    constructor(){
        super()
        if (customElements.get("lit-moveable") == undefined){
            customElements.define("lit-moveable", LitMoveable)
        }
    }

    onDrag(e) {
        e.detail.target.style.transform = e.detail.transform;
        this.translate = e.detail.beforeTranslate;
    }

    onResize(e) {
        const beforeTranslate = e.detail.drag.beforeTranslate
        e.detail.target.style.width = `${e.detail.width}px`
        e.detail.target.style.height = `${e.detail.height}px`
        e.detail.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
        this.translation = beforeTranslate
    }

    render() {
        return html`
                    <div class="target"
                         style=${`width:"${this.width}px" height:"${this.height}px" left:"${this.x}px" top:"${this.y}px"`}   >
                            <slot></slot>
                    </div>
                    <lit-moveable
                      .target=${this.target}
                      .litDraggable=${true}
                      .throttleDrag=${1}
                      .edgeDraggable=${false}
                      .startDragRotate=${0}
                      .throttleDragRotate=${0}
                      .resizable=${true}
                      .keepRatio=${false}
                      @litDrag=${this.onDrag}
                      .renderDirections=${["nw","n","ne","w","e","sw","s","se"]}
                      @litResize=${this.onResize}
                  ></lit-moveable>
        `
    }

    static styles: CSSResultGroup = css`
        :host {
            display: inline-block;
            width: 100%;
            height: 100%;
            position: relative;
            width: 100%;
            height: 90vh;
            overflow: hidden;
            border: 1px solid #ccc;
        }
        .target {
            position: absolute;
            border: 1px solid var(--theme-accentFillSelected);
            box-sizing: border-box;
            overflow: hidden;
            width: 100px;
            height: 100px;
            left: 10px;
            top: 10px;
        }
        
        /* pos guidelines */
        .moveable-normal.red {
            background: red!important;
        }
        /* gap guidelines */
        .moveable-gap.red {
            background: red!important;
        }
        /* When snapped to an element in elementGuidelines */
        .moveable-bold.red {
            background: red!important;
        }
        /* A dashed line between target and element */
        .moveable-dashed.red {
            border-top-color: red!important;
            border-left-color: red!important;
        }
        
        /* pos guidelines */
        .moveable-normal.green {
            background: green!important;
        }
        /* gap guidelines */
        .moveable-gap.green {
            background: green!important;
        }
        /* When snapped to an element in elementGuidelines */
        .moveable-bold.green {
            background: green!important;
        }
        /* A dashed line between target and element */
        .moveable-dashed.green {
            border-top-color: green!important;
            border-left-color: green!important;
        }
        
        `
}