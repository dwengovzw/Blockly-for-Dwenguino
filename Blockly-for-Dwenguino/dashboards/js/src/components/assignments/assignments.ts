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

@customElement("dwengo-assignment-list")
class AssignmentList extends connect(store)(LitElement){
    
}