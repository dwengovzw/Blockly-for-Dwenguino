/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {createRef, Ref, ref} from 'lit/directives/ref.js';
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { marked } from "marked";
import * as DOMPurify from 'dompurify';

@customElement("dwengo-md-editor")
class MarkdownEditor extends LitElement {
    @property({type: String}) value: string = ""
    @property({type: String}) placeholder: string = ""
    @property({type: Boolean}) disabled: boolean = false
    @property({type: Boolean}) readonly: boolean = false
    @property({type: Boolean}) autofocus: boolean = false

    @state() editing: boolean = false
    valueChanged: boolean = false

    constructor(){
        super();
        marked.setOptions({
            gfm: true,
            breaks: true,
            sanitize: true,
            smartLists: true,
            smartypants: true,
        });
    }

    editorRef: Ref<HTMLInputElement> = createRef();

    countNewlines(str: string) {
        const lines = str.split("\n").length
        return lines > 3 ? lines : 3;
    }

    protected render(){
        return html`
            <div class="md_editor">
                ${this.editing ? html`
                    <textarea
                        ${ref(this.editorRef)}
                        rows='${this.countNewlines(this.value || "")}'
                        class="md_editor_textarea"
                        placeholder=${this.placeholder}
                        ?disabled=${this.disabled}
                        ?readonly=${this.readonly}
                        @focusout=${ _ => {
                            this.editing = false
                            if (this.valueChanged){
                                this.dispatchEvent(new CustomEvent("valueChanged", {
                                    detail: {
                                            value: this.value
                                        },
                                        bubbles: true,
                                        composed: true
                                    }))
                                }
                                this.valueChanged = false
                            }
                        }
                        @input=${e => {
                            this.value = (e.target as HTMLTextAreaElement).value
                            this.valueChanged = true
                        }}
                    >${this.value}</textarea>` 
                : html`
                    <div class="md_editor_preview">
                        <div 
                            class="md_editor_preview_content"
                            tabindex="0"
                            @focusin=${ _ => {
                                this.editing = true; 
                            }
                            }>
                            ${unsafeHTML(DOMPurify.sanitize(marked.parse(this.value)))}
                        </div>
                    </div>
                `}
            </div>`
                    
    }

    // Set focus on the textarea when the component is updated
    protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        if (this.editing){
            this.editorRef.value!.focus()
        }
    }

    static styles?: CSSResultGroup = css`
       .md_editor_textarea {
            width: 90%;
            height: auto;
            resize: none;
            border: none;
            overflow: hidden;
            background-color: transparent;
            font-size: 1.5em;
            font-family: "Roboto", "Noto", sans-serif;
       }
       .md_editor_preview_content {
            min-height: 2rem;
       }
    `
}

export { MarkdownEditor }