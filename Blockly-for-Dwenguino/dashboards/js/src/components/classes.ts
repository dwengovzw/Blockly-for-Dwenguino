/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../util"
import {addClassGroup, ClassGroupInfo, getAllClassGroups} from "../state/features/class_group_slice"


import "./menu"
import "@material/mwc-textfield"
import "@material/mwc-button"
import "@material/mwc-checkbox"
import "@material/mwc-formfield"
import "@material/mwc-icon"
import "@material/mwc-circular-progress"




@customElement("dwengo-classes-page")
class Classes extends connect(store)(LitElement) {

    @state() groups: ClassGroupInfo[] = []
    @state() loading: boolean = false;

    stateChanged(state: any): void {
        console.log(state)
        this.groups = structuredClone(state.classGroup.groups)
        this.loading = state.loading
    }

    constructor(){
        super();
        store.dispatch(getAllClassGroups())
    }

    addClassGroup(){
        let info: ClassGroupInfo = {
            name: "test class group",
            description: "test test"
        }
        store.dispatch(addClassGroup(info))
    }
    
    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            This is the classes page.
            <mwc-button @click=${this.addClassGroup} raised>${msg("Save")}</mwc-button>
            <ul>
                ${this.groups.map((group) => {return html`<li>${group.name}-${group.sharingCode}</li>`})}
            </ul>
        `
    }

    static styles?: CSSResultGroup = css`
        
        
    `
}

export default Classes