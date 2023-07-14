/**
 * @author Tom Neutens <tomneutens@gmail.com>
 * Thanks to: https://www.w3schools.com/howto/howto_css_switch.asp
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("dwengo-switch")
class Switch extends LitElement {
    constructor() {
        super();
    }

    // Expose the checked state of the switch as a property
    @property({ type: Boolean })
    checked: boolean = false;

    handleChange(e: Event) {
        this.checked = (e.target as HTMLInputElement).checked;
        this.dispatchEvent(
            new CustomEvent("change", {
                detail: {
                    sourceEvent: e,
                },
                bubbles: e.bubbles,
                cancelable: e.cancelable,
            })
        );
    }

    protected render() {
        return html`
            <label class="switch">
                <input type="checkbox" @change=${this.handleChange} />
                <span class="slider round"></span>
            </label>
        `;
    }

    static styles?: CSSResultGroup = css`
        /* The switch - the box around the slider */
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
        }

        /* Hide default HTML checkbox */
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The slider */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--theme-accentFillSelected, #6DA037);
            -webkit-transition: 0.4s;
            transition: 0.4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 2.2px;
            bottom: 2px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
        }

        input:checked + .slider {
            background-color: var(--theme-accentFillSelected, #6DA037);
        }

        input:focus + .slider {
            box-shadow: 0 0 1px var(--theme-accentFillRest, #87C544);;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(18px);
            -ms-transform: translateX(18px);
            transform: translateX(18px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 22.333px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    `;
}

export default Switch;
