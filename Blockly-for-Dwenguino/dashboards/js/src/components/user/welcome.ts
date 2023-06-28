/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { localized, msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import { UserInfo } from "../../state/features/user_slice"

import "../menu"


@localized()
@customElement("dwengo-welcome-page")
class WelcomePage extends connect(store)(LitElement) {
    
    @property({type: Object}) 
    userInfo: UserInfo | null = store.getState().user
    
    protected render() {
        return html`
            <h1>${msg("Welcome")} ${this.userInfo?.firstname} ${this.userInfo?.lastname}</h1>
            ${this.renderWelcomeMessage()}
        `
    }

    renderWelcomeMessage(){
        return html`
            <div class="welcome-message">
            <p>${msg("The Dwengo simulator is a powerful graphical programming environment where you can develop your programming skills. With this tool, you can program both graphically and textually.")}</p>
            
            <h2>${msg("Graphical Programming Environment")}</h2>
            <p>${msg("In the graphical environment, you can explore various simulation scenarios. Each scenario simulates a robot that you can control using graphical code. The available scenarios are:")}</p>
            <ul>
                <li>${msg("Spirograph: Create beautiful geometric patterns with a virtual drawing robot.")}</li>
                <li>${msg("Moving robot: Program a robot car to move, avoid obstacles, and complete missions.")}</li>
                <li>${msg("Social robot: Create human interactions by building and programming a social robot.")}</li>
                <li>${msg("Conveyor belt robot: Build an automated system that can detect objects on the conveyor belt.")}</li>
            </ul>
            
            <h2>${msg("Textual Programming Environment")}</h2>
            <p>${msg("In addition to the graphical environment, our simulator also provides a textual programming environment where you can write code in C++. Although you cannot simulate this code directly in the browser, you can compile and download it. You can then transfer the downloaded file to the Dwenguino microcontroller via USB, just like you can do with the graphical code.")}</p>
            
            <h2>${msg("Physical Computing Curriculum")}</h2>
            <p>${msg("Do you want to learn more about physical computing and explore the possibilities of the simulator? Visit our website: ")} <a target="_blank" href="${msg("https://dwengo.org/en/physical_computing/")}">${msg("Physical Computing Curriculum")}</a>.</p>
            
            <h2>${msg("Important Information")}</h2>
            <p>${msg("Please note that this simulator is currently in beta phase. This means that some features may change or be removed as we continue to develop and make improvements. We are working hard to provide an optimal programming experience and appreciate your understanding during this process.")}</p>
            <p><strong>${msg('Disclaimer:')}</strong> ${msg('This application is provided "as is" without any warranty, express or implied. The use of this application is at your own risk. We disclaim any warranties, including but not limited to, the implied warranties of merchantability and fitness for a particular purpose. We shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with the use or performance of this application.')}</p>

            <h2>${msg("Privacy Notice")}</h2>
            <p>${msg("If you want a detailed description of how we use your data, you can read our ")}<a target="_blank" href="${msg("https://dwengo.org/assets/files/privacy/privacy_notice_simulator_en.pdf")}">${msg("Privacy Notice")}</a>.</p>
           
            </div>
        `
    }

    /** nl welcome text
     * <div class="welcome-message">
            <p>De Dwengo simulator is een krachtige grafische programmeeromgeving waarin je jouw programmeervaardigheden kunt ontwikkelen. Met deze tool kun je zowel grafisch als tekstueel programmeren.</p>
            
            <h2>Grafische Programmeeromgeving</h2>
            <p>In de grafische omgeving kun je diverse simulatiescenario's verkennen. Elk scenario simuleert een robot die je kunt aansturen met behulp van grafische code. De beschikbare scenario's zijn:</p>
            <ul>
                <li>Spyrograaf: Maak prachtige geometrische patronen met een virtuele tekenrobot.</li>
                <li>Rijdende robot: Programmeer een robotwagen om te bewegen, obstakels te vermijden en missies uit te voeren.</li>
                <li>Sociale robot: Creeër menselijke interacites door een sociale robot te bouwen en te programmeren.</li>
                <li>Lopendebandrobot: Bouw een geautomatiseerd systeem dat kan detecteren welke objecten er op de lopende band liggen.</li>
            </ul>
            
            <h2>Tekstuele Programmeeromgeving</h2>
            <p>Naast de grafische omgeving biedt onze simulator ook een tekstuele programmeeromgeving waarin je code kunt schrijven in C++. Hoewel je deze code niet direct in de browser kunt simuleren, kun je deze wel compileren en downloaden. Het gedownloade bestand kun je vervolgens via USB overzetten naar de Dwenguino-microcontroller, net zoals je dat kunt doen met de grafische code.</p>
            
            <h2>Leerlijn rond Physical Computing</h2>
            <p>Wil je meer leren over pysical computing en de mogelijkheden van de simulator verkennen? Bezoek dan onze website: <a target="_blank" href="https://dwengo.org/physical_computing/">Leerlijn Physical Computing</a>.</p>
            
            <h2>Belangrijke informatie</h2>
            <p>Let op: Deze simulator bevindt zich momenteel in de bètafase. Dit betekent dat sommige functies kunnen veranderen of mogelijk wegvallen naarmate we verder ontwikkelen en verbeteringen aanbrengen. We werken hard om een optimale programmeerervaring te bieden en vragen je begrip tijdens dit proces.</p>
            </div>
     */

    static styles?: CSSResultGroup = css`
        :host {
            padding: var(--theme-main-page-margin);
            margin: 0;
        }
    `
}

export default WelcomePage