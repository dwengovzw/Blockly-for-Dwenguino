import { LitElement, html, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { LearningPath, LearningPathNode, LearningPathTransition, areLearningPathNodesEqual } from '../../state/features/content_slice';
import { ActiveLearningPath, emptyActiveLearningPath, fetchLearningObject, setCurrentStep } from '../../state/features/learning_path_progress_slice';
import { store } from '../../state/store';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import cssLang from 'highlight.js/lib/languages/css';
import cpp from 'highlight.js/lib/languages/cpp';

import highlight_base from 'highlight.js/styles/github.min.css';
import tableStyle from '../../styles/tables.module.css';
import fontStyle from "../../styles/font.module.css";

import { msg } from '@lit/localize';
import '@vaadin/button';
import "../util/code_editor";


@customElement('dwengo-learning-path')
export class LearningPathComponent extends LitElement {
    @property({ type: Object }) activeLearningPath: ActiveLearningPath = emptyActiveLearningPath;

    @state()
    private loading = false; // Added a loading state

    @query('.content')
    contentContainer?: HTMLElement;

    constructor() {
        super();
        hljs.registerLanguage('javascript', javascript);
        hljs.registerLanguage('python', python);
        hljs.registerLanguage('xml', xml);
        hljs.registerLanguage('css', cssLang);
        hljs.registerLanguage('cpp', cpp);
    }

   protected highglightCode(html: string | undefined) {
       if (!html) {
           return "";
       }
       let doc = new DOMParser().parseFromString(html, "text/html")
       let codeElements = doc.querySelectorAll('code');
       codeElements.forEach((codeElement: HTMLElement) => {
           hljs.highlightElement(codeElement as HTMLElement);
       })
       return doc.body.innerHTML;
   }

    // protected highglightCode(html: string | undefined) {
    //     if (!html) {
    //         return "";
    //     }
    //     let doc = new DOMParser().parseFromString(html, "text/html")
    //     let codeElements = doc.querySelectorAll('code');
    //     codeElements.forEach((codeElement) => {
    //         // Create a new <dwengo-code-mirror-element> element
    //         let dwengoCodeElement = document.createElement("dwengo-code-mirror-element");
    //         dwengoCodeElement.setAttribute("code", codeElement.textContent || "");
          
    //         // Copy the content of the <code> element to the new element
    //         dwengoCodeElement.innerHTML = codeElement.innerHTML;
          
    //         // Replace the <code> element with the new element
    //         codeElement.parentNode?.replaceChild(dwengoCodeElement, codeElement);
    //       });

    //     return doc.body.innerHTML;
    // }

    render() {
        return html`
           <div class="container">
                <div class="list list-scrollable">
                    <h1>${this.activeLearningPath.path.title}</h1>
                    ${this.activeLearningPath.path.nodes.map((node, index) => html`
                        <div class="list-item 
                            ${areLearningPathNodesEqual(this.activeLearningPath.progress.current_step, node) ? 'selected' : ''}" 
                            @click="${
                                () => {
                                    store.dispatch(fetchLearningObject(node))
                                }
                            }"
                        >
                            ${node.title}
                        </div>
                    `)}
                </div>
                <div class="content content-scrollable">
                    ${this.loading ? 
                        html`${msg("Loading")}...` : 
                        unsafeHTML(this.highglightCode(this.activeLearningPath.progress.current_step.htmlContent))}
                        <div class="control_buttons">
                            <vaadin-button 
                                theme="primary" 
                                class="paging_control prev_button" 
                                @click="${
                                    () => {
                                        const currentIndex = this.activeLearningPath.path.nodes.findIndex((node) => {
                                            return areLearningPathNodesEqual(node, this.activeLearningPath.progress.current_step)
                                        })
                                        let previousStep = currentIndex > 0 ? this.activeLearningPath.path.nodes[currentIndex - 1] : undefined
                                        if (previousStep){
                                            store.dispatch(fetchLearningObject(previousStep))
                                        }
                                    }
                                }">
                                ${msg("Previous")}
                            </vaadin-button>
                            <vaadin-button
                                theme="primary"
                                class="paging_control next_button"
                                @click="${
                                    () => {
                                        const next = this.activeLearningPath.progress.current_step.transitions.find(
                                            (transition: LearningPathTransition) => transition.default
                                        )?.next
                                        if (next) {
                                            store.dispatch(fetchLearningObject(next))
                                        }
                                    }
                                }">
                                ${msg("Next")}
                            </vaadin-button>
                        </div>
                </div>
            </div>
        `;
    }

    updated() {
        if (MathJax) {
            MathJax.typesetPromise([this.contentContainer]).then(() => {
                console.log("MathJax typeset complete")
            }).catch((err) => console.log(err.message))
        }
    }

    static styles = [css`
        .container {
            display: flex;
            flex-direction: row;
            height: 100%;
            width: 100%;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto;
        }

        .control_buttons {
            margin-top: 30px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .paging_control {
            flex-grow: 1;
        }

        .next_button {
            margin-left: 10px;
        }
        .prev_button {
            margin-right: 10px;
        }

        @media (min-width: 576px){
            .container {
                max-width: 540px;
            }
        }

        @media (min-width: 768px){
            .container {
                max-width: 720px;
            }
        }
        
        @media (min-width: 992px){
            .container {
                max-width: 960px;
            }
        }

        @media (min-width: 1200px){
            .container {
                max-width: 1140px;
            }
            .content {
                padding-left: 30px;
                padding-right: 30px;
            }
        }

        

        .list {
            width: 30%;
            height: 100%;
            overflow-y: auto;
        }

        .list-item {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
        }

        .list-item.selected {
            background-color: #eee;
            border-left: solid black 4px;
            padding-left: 10px;
        }

        .list .list-item:first-of-type {
            border-top: solid #ccc 1px;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
        }

        .list .list-item:last-of-type {
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
        }

        .content {
            width: 70%;
            height: 100%;
            padding: 10px;
            overflow-y: auto;
            margin-left: 10px;
            margin-right: 10px;
        }

        .list-scrollable {
            overflow-y: auto;
            height: calc(100% - 20px);
        }

        .content-scrollable {
            overflow-y: auto;
            height: calc(100% - 20px);
        }

        .content img {
            max-width: 100%;
        }
    
        .content * img {
            max-width: 100%;
        }

        

    `, 
    unsafeCSS(highlight_base),
    unsafeCSS(tableStyle),
    unsafeCSS(fontStyle)]

    
}
