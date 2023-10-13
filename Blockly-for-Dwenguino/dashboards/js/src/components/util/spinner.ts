import { CSSResultGroup, unsafeCSS } from 'lit';
import { LitElement, html, css, customElement } from 'lit-element';

@customElement('dwengo-spinner')
class DwengoSpinner extends LitElement {

    static styles?: CSSResultGroup = css`
            :host {
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: rgba(255, 255, 255, 0.5);
                z-index: 9999;
            }

            .spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                background-image: url('${unsafeCSS(globalSettings.hostname)}/dashboard/assets/img/components/shared/gear_animation.gif');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }
        `;
    

    render() {
        return html`
            <div class="spinner"></div>
        `;
    }
}
