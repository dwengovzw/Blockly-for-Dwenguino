import { LitElement, html, css, property } from 'lit-element';
import {EditorState} from "@codemirror/state"
import {EditorView} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {python} from "@codemirror/lang-python"
import { customElement } from 'lit/decorators.js';

import { minimalSetup } from "codemirror"

@customElement('dwengo-code-mirror-element')
class CodeMirrorElement extends LitElement {
  @property({ type: String }) code = ''; // Property to bind the code value

  render() {
    return html`
      <div>
        <textarea id="codemirror-textarea"></textarea>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    // Initialize CodeMirror
    const codemirrorTextarea = this.shadowRoot?.getElementById('codemirror-textarea');
    if (!codemirrorTextarea) {
      return;
    }
    let editor = new EditorView({
        doc: this.code,
        extensions: [minimalSetup, python()],
        parent: codemirrorTextarea
      })
  }
}
