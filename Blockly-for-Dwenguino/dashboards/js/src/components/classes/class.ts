/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {getClassGroup, ClassGroupInfo, getAllClassGroups, approveStudent} from "../../state/features/class_group_slice"
import { setNotificationMessage, NotificationMessageType } from "../../state/features/notification_slice"

import "../menu"
import "@material/mwc-textfield"
import "@material/mwc-button"
import "@material/mwc-checkbox"
import "@material/mwc-formfield"
import "@material/mwc-icon"
import "@material/mwc-circular-progress"
import "../util/deletable_list_item"




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

    handleDeleteOwner(uuid){
        console.log("Handle delete owner", uuid)
    }

    handleShowOwnerDetail(uuid){
        console.log("Handle show owner deail", uuid)
    }

    handleDeleteStudent(uuid){
        console.log("Handle delete student", uuid)
    }

    handleShowStudentDetail(uuid){
        console.log("handle show student detail", uuid);
    }

    handleRejectStudent(uuid){
        console.log("Handle reject student", uuid);
    }

    handleApproveStudent(studentUuid: string){
        if (!this.uuid){
            store.dispatch(setNotificationMessage(msg("The uuid of this classgroup is unknown."), NotificationMessageType.ERROR, 2500))
            return
        }
        store.dispatch(approveStudent(this.uuid, studentUuid))
    }

    renderOwnerList(){
        return html`
            ${this.classGroup?.ownedBy?.map((owner) => { 
                return html`
                <dwengo-deletable-list-element 
                    fields='${JSON.stringify([ owner.firstname, owner.uuid ])}' 
                    uuid='${owner.uuid}'
                    button_icons='${JSON.stringify(["delete", "list"])}'
                    @dwengo-list-item-delete=${(e) => this.handleDeleteOwner(e.detail.uuid)}
                    @dwengo-list-item-action=${(e) => this.handleShowOwnerDetail(e.detail.uuid)}>
                </dwengo-deletable-list-element>` })}`
    }

    protected render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            ${this.loading ? html`<mwc-circular-progress></mwc-circular-progress>` : ""}
            <h1>${this.classGroup?.name}</h1>
            <p>${this.classGroup?.description}</p>
            <h2>${msg("Sharing code")}</h2>
            <p>${this.classGroup?.sharingCode}</p>
            <h2>${msg("Owners")}</h2>
                ${this.renderOwnerList()}
            <h2>${msg("Students")}</h2>
            ${this.classGroup?.students?.map((student) => 
                { 
                    return html`
                        <dwengo-deletable-list-element 
                            fields='${JSON.stringify([ student.firstname, student.lastname ])}' 
                            uuid='${student.uuid}'
                            @dwengo-list-item-delete=${(e) => this.handleDeleteStudent(e.detail.uuid)}
                            @dwengo-list-item-action=${(e) => this.handleShowStudentDetail(e.detail.uuid)}>
                        </dwengo-deletable-list-element>` })
                }
            <h2>${msg("Awaiting students")}</h2>
            ${this.classGroup?.awaitingStudents?.map((student) => 
                { 
                    return html`<dwengo-deletable-list-element 
                        fields='${JSON.stringify([ student.firstname, student.lastname ])}' 
                        button_icons=${JSON.stringify(["delete", "done"])}
                        uuid='${student.uuid}'
                        @dwengo-list-item-delete=${(e) => this.handleRejectStudent(e.detail.uuid)}
                        @dwengo-list-item-action=${(e) => this.handleApproveStudent(e.detail.uuid)}>
                    </dwengo-deletable-list-element>` })
                }
        `
    }

    static styles?: CSSResultGroup = css`
        mwc-circular-progress {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
    `
}

export default Class