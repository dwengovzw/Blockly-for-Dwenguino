import { LitElement, html, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LearningPath, LearningPathNode, areLearningPathNodesEqual } from '../../state/features/content_slice';
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

import { msg } from '@lit/localize';

@customElement('dwengo-learning-path')
export class LearningPathComponent extends LitElement {
    @property({ type: Object }) activeLearningPath: ActiveLearningPath = emptyActiveLearningPath;

    @state()
    private loading = false; // Added a loading state

    constructor() {
        super();
        hljs.registerLanguage('javascript', javascript);
        hljs.registerLanguage('python', python);
        hljs.registerLanguage('xml', xml);
        hljs.registerLanguage('css', cssLang);
        hljs.registerLanguage('cpp', cpp);
        console.log(unsafeCSS(highlight_base))
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
    render() {
        return html`
           <div class="container">
                <div class="list list-scrollable">
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
                </div>
            </div>
        `;
    }

    static styles = [css`
        .container {
            display: flex;
            flex-direction: row;
            height: 100%;
        }

        .list {
            width: 30%;
            height: 100%;
            overflow-y: auto;
            border-right: 1px solid #ccc;
        }

        .list-item {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #ccc;
        }

        .list-item.selected {
            background-color: #eee;
        }

        .content {
            width: 70%;
            height: 100%;
            padding: 10px;
            overflow-y: auto;
        }

        .list-scrollable {
            overflow-y: auto;
            height: calc(100% - 20px);
        }

        .content-scrollable {
            overflow-y: auto;
            height: calc(100% - 20px);
        }
    `, unsafeCSS(highlight_base)]
}
