/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state, property} from 'lit/decorators.js';
import { store } from "../../state/store"
import { localized, msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import { fetchPublicProfile } from "../../state/features/public_profile_slice";

@localized()
@customElement("dwengo-public-profile-page")
class PublicProfile extends connect(store)(LitElement) {
    @state() name: string = ""
    @property() uuid: string | null = null

    stateChanged(state: any): void {
        this.name = state.publicProfile.name
    }

    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <h1>${this.name}</h1>
        `
    }

    static styles?: CSSResultGroup = css`
                
    `
}

export default PublicProfile