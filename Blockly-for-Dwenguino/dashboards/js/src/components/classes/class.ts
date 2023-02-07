/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {getClassGroup, ClassGroupInfo, getAllClassGroups} from "../../state/features/class_group_slice"

import "../menu"
import "@material/mwc-textfield"
import "@material/mwc-button"
import "@material/mwc-checkbox"
import "@material/mwc-formfield"
import "@material/mwc-icon"
import "@material/mwc-circular-progress"
import "./classgroup_list_item"




@customElement("dwengo-class-page")
class Class extends connect(store)(LitElement) {

    @property() uuid: string | null = null

    @state() classGroup: ClassGroupInfo | null = null
    @state() loading: boolean = false;

    stateChanged(state: any): void {
        console.log(state)
        if (state.classGroup.currentGroup){
            this.classGroup = structuredClone(state.classGroup.currentGroup)
        }
        this.loading = state.loading
    }

    constructor(){
        super();
    }

    connectedCallback() {
        super.connectedCallback()
        if (this.uuid){
            store.dispatch(getClassGroup(this.uuid))
        }
    }

    
    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            ${this.loading ? html`<mwc-circular-progress></mwc-circular-progress>` : ""}
            ${this.classGroup?.ownedBy?.map((owner) => { return owner.name })}
        `
    }

    static styles?: CSSResultGroup = css`
        mwc-circular-progress {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
    `
}

export default Class