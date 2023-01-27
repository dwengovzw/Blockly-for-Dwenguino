import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/login_component_lit.ts";

@customElement("dwengo-dashboard")
class Dashboard extends LitElement {
    protected render() {
        return html`<dwengo-login-menu></dwengo-login-menu>`
    }
}

const globalStyle = css`
`

export default Dashboard