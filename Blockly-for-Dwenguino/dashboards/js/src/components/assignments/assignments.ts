/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, state, property} from 'lit/decorators.js';
import { store } from "../../state/store"
import { localized, msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {ClassGroupInfo, getClassGroup} from "../../state/features/class_group_slice"


import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/text-area';
import '@vaadin/button';
import "../util/star-checkbox"
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import type { GridDragStartEvent } from '@vaadin/grid';
import { dialogFooterRenderer, dialogRenderer } from '@vaadin/dialog/lit.js';
import type { DialogOpenedChangedEvent } from '@vaadin/dialog';
import { UserInfo } from "../../state/features/user_slice";
import { AssignmentGroupInfo, saveAssignmentGroup, deleteAssignmentGroup, getAllAssignmentGroups, favortieAssignmentGroup } from "../../state/features/assignment_group_slice"
import { StudentTeamInfo } from "../../state/features/student_team_slice";
import { setNotificationMessage, NotificationMessageType } from "../../state/features/notification_slice";

@localized()
@customElement("dwengo-assignment-list")
class AssignmentList extends connect(store)(LitElement){
    @property({type: Object}) 
    classGroupProp: ClassGroupInfo | null = null
    @state()
    classGroup: ClassGroupInfo | null = null

    @state() showEditDialog: boolean = false

    @state() editedAssignmentGroupInfo: AssignmentGroupInfo = {
        name: "",
        description: "",
        starred: false,
        studentTeams: [],
        inClassGroupUUID: this.classGroup?.uuid || ""
    }

    @property({type: Object}) 
    assignmentGroupsProp: AssignmentGroupInfo[] = []
    @state()
    assignmentGroups: AssignmentGroupInfo[] = []

    @state() itemSelectedToDelete: AssignmentGroupInfo | null = null
    @state() showConfirmDialog: boolean = false
    @state() draggedItem?: UserInfo
    @state() studentTeams: StudentTeamInfo[] = []


    protected willUpdate(_changedProperties: PropertyValueMap<this>) {
        super.willUpdate(_changedProperties);
        if (_changedProperties.has("classGroupProp")){
            this.classGroup = structuredClone(this.classGroupProp)
        }
        if (_changedProperties.has("assignmentGroupsProp")){
            this.assignmentGroups = structuredClone(this.assignmentGroupsProp)
        }
    }

    // Using -1 as null value since null and 0 conflict
    private draggedItemSourceIndex: number = -1

    /**
     * Reset the contents of the assignment edit dialog to an empty value.
     * Used to render the dialog for creating new assignment.
     */
    private resetEditDialog(){
        if (this.classGroup && this.classGroup.students && this.classGroup.uuid){
            this.studentTeams = [
                {
                    students: [...this.classGroup?.students]
                }
            ]
            this.editedAssignmentGroupInfo = {
                name: "",
                description: "",
                starred: false,
                studentTeams: [],
                inClassGroupUUID: this.classGroup?.uuid
            }
        }
       
    }

    private createTeam(name) {
        let team: StudentTeamInfo = {
            students: []
        }
        this.studentTeams = [...this.studentTeams, team]
    }

    private handleDeleteAssignment(uuid: string | undefined) {
        if (this.classGroup?.uuid && uuid){
            store.dispatch(deleteAssignmentGroup(this.classGroup?.uuid, uuid))
        }
        this.showConfirmDialog = false
    }

    private handleShowEditDialog(assignmentGroup: AssignmentGroupInfo | null){
        if (!assignmentGroup){
            this.resetEditDialog()
        } else {
            // Aggregate all students that have been teamed up in this assignmentGroup by collecting their uuid
            let teamedUpStudents = assignmentGroup.studentTeams.reduce((reduced:string[], current) => {
                return [...reduced, ...current.students.map(student => student.uuid ? student.uuid : "")]
            }, [])
            // Filter out the students that have not been teamed up
            let remainingStudents: StudentTeamInfo = {
                students: this.classGroup?.students?.filter(student => {return student.uuid ? !teamedUpStudents.includes(student.uuid) : false}) || []
            }
            // Create student teams array with the first item containing the remaining students
            this.studentTeams = [remainingStudents, ...assignmentGroup.studentTeams]
            this.editedAssignmentGroupInfo.name = assignmentGroup.name
            this.editedAssignmentGroupInfo.description = assignmentGroup.description
            this.editedAssignmentGroupInfo.uuid = assignmentGroup.uuid
        }
        this.showEditDialog = true;
    }

    renderHeader(){
        return html`
        <div class="header">
            <h1>${msg("Assignments")}</h1>
            <h1>
                <vaadin-button theme="primary" @click="${() => {this.handleShowEditDialog(null)}}">
                    <span>
                        ${msg("Create assignment")}
                    </span>
                </vaadin-button>
            </h1>
        </div>
        `
    }

    renderConfirmDialog(name: string | undefined, uuid: string | undefined){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}" @closed=${_ => this.showConfirmDialog = false}>
            <div>
                ${msg("Are you sure you want to remove this classgroup: ")}<em>${name}</em>?
            </div>
            <mwc-button @click="${() => {this.handleDeleteAssignment(uuid)}}" slot="primaryAction" dialogAction="close">
                ${msg("Yes")}
            </mwc-button>
            <mwc-button @click="${() => {this.showConfirmDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    renderEditMenu() {

    }


    renderAssignmentsOverview(){
        return html`
            <vaadin-grid .items="${this.assignmentGroups}">
            
                <vaadin-grid-column path="name"></vaadin-grid-column>
                <vaadin-grid-column flex-grow="10" path="description"></vaadin-grid-column>
                <vaadin-grid-column 
                    path="starred"
                    ${columnBodyRenderer(
                        (assignmentGroup: AssignmentGroupInfo) => html`
                            <star-checkbox  
                                .checked=${assignmentGroup.starred}
                                @click=${
                                    (e)=>{
                                        if (assignmentGroup.uuid && this.classGroup?.uuid) {
                                            store.dispatch(
                                                favortieAssignmentGroup(
                                                    this.classGroup?.uuid, 
                                                    assignmentGroup.uuid, 
                                                    e.target.checked))}}}>
                            </star-checkbox>`,
                        []
                    )}
                    >
                </vaadin-grid-column>
                <vaadin-grid-column
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (assignmentGroup: AssignmentGroupInfo) => html`
                        <vaadin-button 
                            theme="primary" 
                            class="item" 
                            @click="${() => {this.handleShowEditDialog(assignmentGroup)}}">
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </vaadin-button>`,
                    []
                )}
                ></vaadin-grid-column>
                <vaadin-grid-column
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (assignmentGroup: AssignmentGroupInfo) => html`
                        <vaadin-button 
                            theme="primary" 
                            class="item" 
                            @click="${() => {this.itemSelectedToDelete = assignmentGroup; this.showConfirmDialog = true}}">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </vaadin-button>`,
                    []
                )}
                ></vaadin-grid-column>
            </vaadin-grid>
        `
    }


    private saveStudentTeams = () => {
        if (!this.editedAssignmentGroupInfo.name){
            store.dispatch(setNotificationMessage(msg("An assignment name is required"), NotificationMessageType.ERROR, 2500))
            return
        }
        if (!this.classGroup?.uuid){
            store.dispatch(setNotificationMessage(msg("An error occured, please try again"), NotificationMessageType.ERROR, 2500))
            return
        }
        this.editedAssignmentGroupInfo.studentTeams = this.studentTeams.filter((element, i) => {return (i > 0 ? true : false)})
        this.editedAssignmentGroupInfo.inClassGroupUUID = this.classGroup?.uuid
        store.dispatch(saveAssignmentGroup(this.editedAssignmentGroupInfo))
        this.showEditDialog = false;
    }
    
      private clearDraggedItem = () => {
        this.draggedItemSourceIndex = -1  // If dragging from student list use index -1 since not in list of student teams
        delete this.draggedItem;
      };

      private renderEditDialogDraggableGrid(team, index) {
        return html`
                    <div class="draggable_grid_container">
                        <vaadin-grid
                            .items="${team.students}"
                            rows-draggable
                            drop-mode="on-grid"
                            all-rows-visible
                            @grid-dragstart="${
                                (event: GridDragStartEvent<UserInfo>) => {
                                    this.draggedItemSourceIndex = index  // If dragging from student list use index -1 since not in list of student teams
                                    this.draggedItem = event.detail.draggedItems[0];
                                }}"
                            @grid-dragend="${this.clearDraggedItem}"
                            @grid-drop="${() => {
                                // If no valid source list return
                                if (this.draggedItemSourceIndex == -1){
                                    return
                                }
                                let sourceList = this.studentTeams[this.draggedItemSourceIndex].students
                                const draggedPerson = this.draggedItem!;
                                const draggedItemIndex = sourceList.indexOf(draggedPerson);
                                if (draggedItemIndex >= 0) {
                                    // Remove the item from its previous position
                                    sourceList.splice(draggedItemIndex, 1);
                                    // Re-assign the array to refresh the grid
                                    this.studentTeams[this.draggedItemSourceIndex].students = [...sourceList]
                                    // Re-assign the array to refresh the grid
                                    this.studentTeams[index].students = [...this.studentTeams[index].students, draggedPerson]
                                    this.studentTeams = [...this.studentTeams]
                                }
                            }}"
                        >
                            <vaadin-grid-column
                            header="${ index === 0 ? msg("Students"): msg("Team") + " " + index}"
                            ${columnBodyRenderer<UserInfo>(
                                (user) => html`${user.firstname} ${user.lastname}`,
                                []
                            )}
                            ></vaadin-grid-column>
                        </vaadin-grid>
                        
                    </div>
                    `
      }

      private renderEditDialogDraggableGridDeleteButton(team, index) {
        return html`
            <vaadin-button 
                theme="primary" 
                class="item" 
                @click="${() => {
                    // Get students of team that will be removed
                    let students = this.studentTeams[index].students
                    // Add them to class
                    this.studentTeams[0].students = [...this.studentTeams[0].students, ...students]
                    // Remove team
                    this.studentTeams.splice(index, 1)
                    // Force update
                    this.studentTeams = [...this.studentTeams]
                }
                }">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </vaadin-button>
        `
    }

      renderDialogStyle(){
        return html`
        <style>
            .manual_group_creation_view {
                display: flex;
                flex-direction: row;
            }

            .list_container {
                flex-grow:1;
                max-height: 400px;
                overflow-y: scroll;
            }

            vaadin-dialog-overlay::part(overlay) {
                width: 90vw;
            }
            .draggable_grid_container {
                margin: 0.3rem 1rem;
                flex-grow: 1;
            }
            .students_teams_list_container {
                
            }
            .teamcontainer {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            .create_team_button_container {
                display: flex;
                flex-direction: row;
                justify-content: center;
            }
        </style>
        `
      }

    renderDialogContent() {
        return html`
        ${this.renderDialogStyle()}
        <div><vaadin-text-field .value=${this.editedAssignmentGroupInfo.name} .required=${true} @change=${(e) => this.editedAssignmentGroupInfo.name = e.target.value } outlined label="${msg("Name")}" type="text"></vaadin-text-field></div>
        <div><vaadin-text-area .value=${this.editedAssignmentGroupInfo.description} @change=${(e) => this.editedAssignmentGroupInfo.description = e.target.value } outlined label="${msg("Description")}"></vaadin-text-area></div>
        <div class="manual_group_creation_view">
            <div class="students_list_container list_container">
                ${this.studentTeams.length > 0 ? this.renderEditDialogDraggableGrid(this.studentTeams[0], 0) : ""}
            </div>
            <div class="students_teams_list_container list_container">
                ${this.studentTeams.filter((element, i) => {return (i > 0 ? true : false)}).map((team, index) => {
                    return html`
                    <div class="teamcontainer">
                        ${this.renderEditDialogDraggableGrid(team, index+1)}
                        ${this.renderEditDialogDraggableGridDeleteButton(team, index+1)}
                    </div>
                        `
                })}
                <div class="create_team_button_container">
                    <vaadin-button 
                        theme="primary"
                        @click=${()=>{
                            this.createTeam("test")
                        }}
                        >${msg("Create team")}
                    </vaadin-button>
                </div>
            </div>
        </div>
        `
    }

    private close() {
        this.showEditDialog = false;
    }

    renderDialogFooter() {
        return html`
            <vaadin-button @click="${this.close}">${msg("Cancel")}</vaadin-button>
            <vaadin-button theme="primary" @click="${this.saveStudentTeams}">${msg("Save")}</vaadin-button>
        `
    }

    renderEditDialog(){
        // Add the students in this class to the first student team (= frow which to pick)
        return html`
        <vaadin-dialog
            resizable
            theme="primary"
            draggable
            header-title="${msg("Edit assignment")}"
            .opened="${this.showEditDialog}"
            @opened-changed="${(event: DialogOpenedChangedEvent) => {
                this.showEditDialog = event.detail.value;
                
            }}"
            ${dialogRenderer(this.renderDialogContent, [this.classGroup?.students, this.studentTeams])}
            ${dialogFooterRenderer(this.renderDialogFooter, [])}
        ></vaadin-dialog>
        `
    }

    protected render() {
            return html`
                ${getGoogleMateriaIconsLinkTag()}
                ${this.renderHeader()}
                ${this.renderAssignmentsOverview()}
                ${this.renderEditDialog()}
                ${this.showConfirmDialog ? this.renderConfirmDialog(this.itemSelectedToDelete?.name, this.itemSelectedToDelete?.uuid) : ""}
            `
    }

    static styles?: CSSResultGroup = css`
        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .manual_group_creation_view {
            display: flex;
            flex-direction: row;
        }

        .list_container {
            flex-grow:1;
        }

        vaadin-dialog-overlay::part(overlay) {
            width: 90%;
        }
        
    `
}