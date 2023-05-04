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
        <div class="root">
                <div class="container">
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
                </div>
                </div>
        `
    }

    static styles: CSSResultGroup = css`
    html, body {
        position: relative;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    html:has(.no-relative), body:has(.no-relative) {
        margin: 8px;
        padding: 8px;
        position: static;
        /* border: 8px solid red; */
    }
    html:has(.no-relative) {
        position: relative;
    }
    html:has(.margin), body:has(.margin) {
        /* margin-top: 50px; */
    }
    .margin .root {
        position: static;
    }
    .description {
        padding: 10px;
    }
    .root {
        position: relative;
    }
    .container {
        position: relative;
        margin-top: 50px;
    }
    .will-change-container {
        padding-left: 100px;
        padding-top: 100px;
        will-change: transform;
    }
    .will-change-target {
        position: relative;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        background: #ee8;
        color: #333;
        font-weight: bold;
        border: 1px solid #333;
        box-sizing: border-box;
    }
    .target {
        position: absolute;
        width: 100px;
        height: 100px;
        top: 150px;
        left: 100px;
        line-height: 100px;
        text-align: center;
        background: #ee8;
        color: #333;
        font-weight: bold;
        border: 1px solid #333;
        box-sizing: border-box;
    }
    
    .target1 {
        left: 120px;
        top: 120px;
    }
    
    .target2 {
        left: 300px;
        top: 140px;
    }
    
    .target3 {
        left: 180px;
        top: 250px;
    }
    
    .nested {
        position: absolute;
        border: 4px solid #ccc;
        width: 100px;
        height: 100px;
        top: 50px;
        left: 70px;
        color: #333;
        /* box-sizing: border-box; */
    }
    
    .nested.first {
        top: 150px;
    }
    
    .nested.rotate {
        transform-origin: 0 0;
        transform: rotate(-30deg);
    }
    
    .nested.scale {
        transform: scale(1.5, 1.5);
    }
    
    .nested .target {
        top: 50px;
        left: 50px
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
    
    .scrollArea {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100vh - 100px);
        overflow: auto;
    }
    .scrollArea:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 300%;
        width: 100%;
        background: linear-gradient(
            #333,
            #fff
        );
    }
    .infinite-viewer {
        height: 500px;
    }`

    /*
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

        .container {
            position: relative;
            width: 100%;
            height: 90vh;
            overflow: hidden;
            border: 1px solid #ccc;
         }

         .root {
            position: relative;
        }
        
        .moveable-normal.red {
            background: red!important;
        }
        .moveable-gap.red {
            background: red!important;
        }
        .moveable-bold.red {
            background: red!important;
        }
        .moveable-dashed.red {
            border-top-color: red!important;
            border-left-color: red!important;
        }
        
        .moveable-normal.green {
            background: green!important;
        }
        .moveable-gap.green {
            background: green!important;
        }
        .moveable-bold.green {
            background: green!important;
        }
        .moveable-dashed.green {
            border-top-color: green!important;
            border-left-color: green!important;
        }
        
        `*/
}