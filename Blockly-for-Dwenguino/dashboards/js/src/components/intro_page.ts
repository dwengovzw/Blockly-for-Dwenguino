import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js"; // needs .js to transpile

@customElement("dwengo-intro-page")
class IntroPage extends LitElement {


    protected render() {
        return html`Welkom op de dwengo intro pagina. Maak een account of log in om een eigen portfolio te maken.`
    }
}


export default IntroPage