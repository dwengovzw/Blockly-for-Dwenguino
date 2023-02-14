import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { connect } from "pwa-helpers"
import { store } from "../state/store"
import { hide } from "../state/features/notification_slice"

@customElement("dwengo-notify")
class Notify extends connect(store)(LitElement) {

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

    @state() message: string = ""
    @state() styleClass: string = ""
    prevVisibility = "hidden"

    stateChanged(state: any): void {
        this.message = state.notification.message
        if (this.prevVisibility === "hidden" && state.notification.visible){
            this.styleClass = `${state.notification.class} visible` 
            this.prevVisibility = "visible"
            // Dispatch hide action after n ms
            setTimeout(() => {store.dispatch(hide())}, state.notification.time)
        } else {
            this.styleClass = `${state.notification.class} hidden` 
            this.prevVisibility = "hidden"
        }
        
    }
    
    protected render() {
        return html`<div class="${this.styleClass}">${this.message}</div>`
    }
}


export default Notify