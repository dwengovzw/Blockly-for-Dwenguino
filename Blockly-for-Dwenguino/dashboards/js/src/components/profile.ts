/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../util"
import { UserInfo, initialUserState, putUserInfo } from "../state/features/user_slice"


import "./menu"
import "@material/mwc-textfield"
import "@material/mwc-button"
import "@material/mwc-checkbox"
import "@material/mwc-formfield"
import "@material/mwc-icon"
import "@material/mwc-circular-progress"
import '@vaadin/date-picker';
import '@vaadin/text-field';
import '@vaadin/email-field';



@customElement("dwengo-profile-page")
class Profile extends connect(store)(LitElement) {
    @state() userInfo: UserInfo = initialUserState

    @state() checkboxFocussed: boolean = false;

    stateChanged(state: any): void {
        this.userInfo = structuredClone(state.user)
    }

    constructor(){
        super();
    }

    handleSave(){
        console.log(this.userInfo)
        store.dispatch(putUserInfo(this.userInfo))
    }

    addRole(role:string){
        if ((role === "student" || role === "teacher") && !this.userInfo.roles.includes(role)){
            this.userInfo.roles.push(role);
        }
    }

    removeRole(role:string){
        this.userInfo.roles = this.userInfo.roles.filter((r) => r !== role);
    }

    
    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <h1>${msg("Profile")} ${this.userInfo?.firstname} ${this.userInfo?.lastname}</h1>
            <div class="profile-info">
                <div><vaadin-text-field @change=${(e) => this.userInfo.firstname = e.target.value } outlined label="${msg("Firstname")}" type="text" value="${this.userInfo?.firstname}"></vaadin-text-field></div>
                <div><vaadin-text-field @change=${(e) => this.userInfo.lastname = e.target.value } outlined label="${msg("Lastname")}" type="text" value="${this.userInfo?.lastname}"></vaadin-text-field></div>
                <div><vaadin-email-field @change=${(e) => this.userInfo.email = e.target.value } outlined label="${msg("Email")}" type="email" value="${this.userInfo?.email}"></vaadin-email-field></div>
                <div><vaadin-date-picker @change=${(e) => this.userInfo.birthdate = new Date(e.target.value).toISOString()} outlined label="${msg("Birthdate")}" value="${this.userInfo?.birthdate ? `${new Date(this.userInfo?.birthdate as string).toISOString().split('T')[0]}`: ""}"></vaadin-date-picker></div>
                <div class="checkbox-container ${this.checkboxFocussed ? "highlightborder" : ""}">
                    <span class="checkbox-label ${this.checkboxFocussed ? "highlightlabel" : ""}">${msg('My roles')}</span>
                    <mwc-formfield label="${msg("Student")}">
                        <mwc-checkbox 
                            @change=${(e) => e.target.checked ? this.addRole("student") : this.removeRole("student") } 
                            @focusout=${(e)=>{this.checkboxFocussed = false}} 
                            @focus=${(e)=>{this.checkboxFocussed = true}}
                            ?checked=${this.userInfo.roles.includes("student")}
                            disabled="true"></mwc-checkbox>
                    </mwc-formfield>
                    <mwc-formfield label="${msg("Teacher")}">
                        <mwc-checkbox 
                            @change=${(e) => e.target.checked ? this.addRole("teacher") : this.removeRole("teacher") } 
                            @focusout=${(e)=>{this.checkboxFocussed = false}} 
                            @focus=${(e)=>{this.checkboxFocussed = true}} 
                            ?checked=${this.userInfo.roles.includes("teacher")}
                            disabled="true"></mwc-checkbox>
                    </mwc-formfield>
                </div>
                <div><mwc-textfield outlined label="${msg("You are logged in with")}" type="text" disabled="true" value= "${this.userInfo?.platform}"></mwc-textfield></div>
                <mwc-button @click=${this.handleSave} raised>${msg("Save")}</mwc-button>
            </div>
        `
    }

    static styles?: CSSResultGroup = css`
        :host{
            padding: var(--theme-main-page-margin);
            margin: 0;
        }
        vaadin-email-field::part(label) {
            color: var(--theme-accentFillSelected);
        }
        
        vaadin-date-picker::part(label) {
            color: var(--theme-accentFillSelected);
        }
        
        vaadin-text-field::part(label) {
            color: var(--theme-accentFillSelected);
        }

        mwc-textfield {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        mwc-button {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        mwc-checkbox {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        .profile-info div {
            margin: 1rem 0;
        }
        mwc-formfield {
            display: block;
        }
        .checkbox-container.highlightborder {
            border-color: var(--theme-accentFillSelected);
        }
        .checkbox-container {
            display: inline-block;
            padding: 0px 27px 10px 16px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.38);
        }
        .checkbox-label.highlightlabel {
            color: var(--theme-accentFillSelected);
        }
        .checkbox-label {
            position: relative;
            top: -0.65rem;
            padding: 0.3rem;
            left: 0.2rem;
            font-size: 0.75rem;
            color: rgba(0, 0, 0, 0.6);
            background-color: var(--theme-neutralFocusInnerAccent);
            z-index: 5;
        }
        mwc-checkbox {
            --mdc-theme-secondary: var(--theme-accentFillSelected);
        }
        mwc-circular-progress {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        
    `
}

export default Profile