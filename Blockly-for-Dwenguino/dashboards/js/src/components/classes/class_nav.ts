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

@customElement("dwengo-class-nav")
class ClassNav extends connect(store)(LitElement) {
    private _routes = new Routes(this, [
        {path: '/:uuid/info*', name: "info", render: ({uuid}) => this.renderDetails(uuid)},
        {path: '/:uuid/assignments*', name: "assignments", render: ({uuid}) => this.renderAssignments(uuid)}
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
               
            </vaadin-tabs>`
    }
    renderDetails(uuid: string | undefined){
        if (!uuid){
            return ""
        }
        return html`
            ${this.renderTabs(0, uuid)}
            <dwengo-class-page uuid="${uuid}"></dwengo-class-page>`
    }
    renderAssignments(uuid: string | undefined){
        if (!uuid){
            return ""
        }
        return html`
            ${this.renderTabs(1, uuid)}
            <h1>Assignments</h1>`
    }

    protected render(){
        return this._routes.outlet()
    }
}

export default ClassNav