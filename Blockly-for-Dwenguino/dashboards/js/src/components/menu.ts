import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js"; // needs .js to transpile
import { Router, Routes } from "@lit-labs/router"

@customElement("dwengo-menu")
class Menu extends LitElement {
    private router = new Routes(this, [
        {path: 'home', render: () => html`<h1>home</h1>`},
        {path: 'profile', render: () => html`<h1>profile </h1>`}
    ]);
    protected render() {
        return html`test<div>${this.router.outlet()}</div>`
    }
}


export default Menu