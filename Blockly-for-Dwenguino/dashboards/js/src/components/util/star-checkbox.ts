/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { localized } from "@lit/localize";
import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property } from 'lit/decorators.js';

@localized()
@customElement('star-checkbox')
class StarCheckbox extends LitElement{
    @property({type: Boolean})
    checked: boolean = false;

    @property({type: Boolean})
    disabled: boolean = false;

    @property({type: Boolean})
    value: boolean = false;

    protected render() {
        return html`
            <input 
                aria-label="Star checkbox"
                type="checkbox" 
                class="star" 
                .checked=${this.checked} 
                ?disabled=${this.disabled} 
                @click=${(e)=>{this.checked = e.target.checked}}>
        `;
    }

    static styles?: CSSResultGroup = css`
        :host {
            display: inline-block;
            font-size: 1.5em;
            padding: 0.5em;
            cursor: pointer;
        }
        .star {
            visibility:hidden;
            font-size:30px;
            cursor:pointer;
        }
        .star:before {
            content: "\\2605";
            position: relative;
            top: -15px;
            left: -7.5px;
            visibility:visible;
            color: var(--theme-accentFillSelected)
        }
        .star:checked:before {
            content: "\\2606";
            position: relative;
            top: -15px;
            left: -7.5px;
            color: var(--theme-accentFillSelected)
        }
      `
    
}

export { StarCheckbox }