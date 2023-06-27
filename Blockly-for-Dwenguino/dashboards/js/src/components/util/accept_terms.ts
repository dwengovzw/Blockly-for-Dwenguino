/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, query, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"

import "@material/mwc-button"
import "@material/mwc-dialog"
import '@vaadin/button';
import { putUserInfo } from "../../state/features/user_slice";
import { borderStyle, buttonStyles } from "../../styles/shared";

@customElement("dwengo-accept-terms")
class AcceptTerms extends connect(store)(LitElement) {
    @state() accepted: boolean = false;

    @property({type: Object})
    userInfo: any = store.getState().user

    @query("#confirm_dialog")
    dialog!: HTMLDialogElement;

    handleAcceptTerms(){
        let updatedUserInfo = structuredClone(this.userInfo)
        updatedUserInfo.acceptedTerms = true;
        store.dispatch(putUserInfo(updatedUserInfo))
        //this.dialog.close();
    }

    render(){
        return html`
        <dialog 
            class="dwengo-border"
            id="confirm_dialog">
            <h1>${msg("Terms and conditions")}</h1>
            <h3>${msg("Privacy notice")}</h3>
            <p>
                ${msg(`As a provider of a digital learning system, we place great importance on protecting your personal data and ensuring the confidentiality of your information. In this message, we would like to inform you about what data we collect from you, how we process it, and which other institutions we share it with.
                Firstly, all data we collect is stored on servers located in Europe. This ensures that your data is subject to European legislation and that your privacy and security are safeguarded.
                We record every modification and execution of a program, as well as interactions in our simulation environment (such as pausing, starting, stepping through the code, and adjusting the speed). This allows us to track your learning progress and provide you with accurate feedback.
                Additionally, we store information about your tutorial progress, including the steps you go through and when you stop the tutorial. This enables us to improve and adapt our tutorials to better meet your learning needs.
                If you use our robot simulator, we keep track of which components you add or remove when building a robot. This information allows us to improve our simulation environment and add new features to meet your needs.
                When you sign up for our digital learning system, you use an external identity provider. To identify you as a unique user, we keep track of which identity provider you used to sign up and the unique ID you have with that provider. We also ask for your name through this provider.
                In addition to this data, you have the option to provide your email address and date of birth. It is important to note that your personally identifiable data, such as your name, email address, and date of birth, are only used within our application. You, as the user, have the option to decide with which other users you want to share your data. For example, a student must actively participate in a class group before their name becomes visible to the administrator of that group.
                In addition to personally identifiable data, we also keep track of the activities of logged-in users. This includes information about the programs users save, the portfolios they create, the items they add to their portfolios, the feedback linked to a portfolio, the class groups they are in, the student teams they are in, and the assignments they receive.
                It is possible that we share non-personally identifiable data with research institutions. This research aims to provide users of our system with better insights into the learning process of their students and to provide better feedback as a result. We use aggregated data for this purpose, so that individual users cannot be identified.
                Finally, as a user, you have the right to request the data we collect about you, as long as you can identify yourself. This can be done, for example, by providing a copy of your identity card or via the KopieID app.
                We hope that this message has sufficiently informed you about our policy regarding the collection, processing, and sharing of your data. If you have any further questions or comments, please do not hesitate to contact us at dpo@dwengo.org.
                `)}
            </p>
            <p>${msg("By accepting our terms of service you agree to the collection of the data listed in the privacy notice.")}</p>
            <h3>${msg("Waranty")}</h3>
            <p>
                ${msg('This application is provided "as is" without any warranty, express or implied. The use of this application is at your own risk. We disclaim any warranties, including but not limited to, the implied warranties of merchantability and fitness for a particular purpose. We shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with the use or performance of this application.')}
            </p>
            <p>
                ${msg("By accepting our terms of service you agree to the warranty.")}
            </p>
            <div>
                <div class="confirm_container">
                    <span>
                        <label for="terms">${msg("I accept the terms and conditions")}</label>
                        <input @change=${
                                (e) => {
                                    this.accepted = e.target.checked;
                                }
                            } 
                            type="checkbox" id="terms" name="terms" value="terms" required>
                    </span>
                    <vaadin-button theme="primary" class="dwengo-button confirm_button" .disabled=${!this.accepted} slot="primaryAction" dialogAction="ok" @click=${this.handleAcceptTerms}>
                        ${msg("Confirm")}
                    </vaadin-button>
                </div>
            </div>
        </dialog>
        `
    }

    firstUpdated() {
        this.dialog.showModal();
        this.dialog.scrollTop = 0;
    }

    static get styles(): CSSResultGroup {
        return [css`
            .confirm_container{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            #confirm_dialog{
                max-width: 720px;
                margin: 10px auto;
                padding: 10px;
            }
            mwc-button.confirm_button {
                --mdc-theme-on-primary: white;
            }
        `, borderStyle, buttonStyles]
    }
}
