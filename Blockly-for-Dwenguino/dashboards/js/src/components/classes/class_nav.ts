/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {getClassGroup, ClassGroupInfo, getAllClassGroups, approveStudent, deleteStudent} from "../../state/features/class_group_slice"
import { setNotificationMessage, NotificationMessageType } from "../../state/features/notification_slice"
import { Routes } from "@lit-labs/router"

import '@vaadin/tabs'
import "./class"
import "../assignments/assignments"
import Class from "./class";
import { getAllAssignmentGroups } from "../../state/features/assignment_group_slice";

@customElement("dwengo-class-nav")
class ClassNav extends connect(store)(LitElement) {
    @property({type: Object}) 
    classGroup: ClassGroupInfo | null = store.getState().classGroup.currentGroup
    @property({type: Object})
    assignmentGroups: any = store.getState().assignments.groups

    private _routes = new Routes(this, [
        {path: 'info*', name: "info", render: () => this.renderDetails()},
        {
            path: 'assignments*', 
            name: "assignments", 
            enter: () => {
                if (!this.classGroup?.uuid){
                    return false
                }
                store.dispatch(getAllAssignmentGroups(this.classGroup.uuid))
                return true
            },
            render: () => this.renderAssignments()
        },
        {path: 'insights*', name: "insights", render: () => html`No insights yet`}
    ])

    renderTabs(selectedIndex: number, uuid: string) {
        return html`
            <vaadin-tabs theme="centered" selected=${selectedIndex}>
                
                    <vaadin-tab>
                        <a href="${globalSettings.hostname}/dashboard/classes/class/${uuid}/info">
                            ${msg("Details")}
                        </a>
                    </vaadin-tab>
                    <vaadin-tab>
                        <a href="${globalSettings.hostname}/dashboard/classes/class/${uuid}/assignments">
                            ${msg("Assignments")}
                        </a>
                    </vaadin-tab>
                    <vaadin-tab>
                    <a href="${globalSettings.hostname}/dashboard/classes/class/${uuid}/insights">
                        ${msg("Insights")}
                    </a>
                </vaadin-tab>
            </vaadin-tabs>`
    }
    renderDetails(){
        if (!this.classGroup?.uuid){
            return ""
        }
        return html`
            ${this.renderTabs(0, this.classGroup?.uuid)}
            <dwengo-class-page .classGroup=${this.classGroup}></dwengo-class-page>`
    }
    renderAssignments(){
        if (!this.classGroup?.uuid){
            return ""
        }
        return html`
            ${this.renderTabs(1, this.classGroup?.uuid)}
            <dwengo-assignment-list .classGroupProp=${this.classGroup} .assignmentGroupsProp=${this.assignmentGroups}></dwengo-assignment-list>`
    }

    protected render(){
        return this._routes.outlet()
    }
}

export default ClassNav