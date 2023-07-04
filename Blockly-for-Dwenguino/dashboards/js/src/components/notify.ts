import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js"; // needs .js to transpile
import { connect } from "pwa-helpers"
import { store } from "../state/store"
import { localized } from "@lit/localize";

@localized()
@customElement("dwengo-notify")
class Notify extends connect(store)(LitElement) {

    @property({ type: Object })
    notificationState: any = store.getState().notification
    
    protected render() {
        return html`
        <div class="${this.notificationState.class} ${this.notificationState.visible ? "visible" : "hidden"}">
            ${this.notificationState.message}
        </div>`
    }

    static styles?: CSSResultGroup = css`
    :host {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }
    div {
        position: absolute;
        width: 80%;
        border: 1px solid;
        border-radius: 10px;
        padding: 2rem;
        margin: 11rem auto;
        z-index: 10000;
    }
    div.message {
        border-color: var(--theme-notification-message-border-color);
        background-color: var(--theme-notification-message-background-color);
        color: var(--theme-notification-message-color);
    }
    div.error {
        border-color: var(--theme-notification-error-border-color);
        background-color: var(--theme-notification-error-background-color);
        color: var(--theme-notification-error-color);
    }
    div.visible {
        visibility: visible;
    }
    div.hidden{
        visibility: hidden;
    }
`
}


export default Notify