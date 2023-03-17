/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import {getClassGroup} from "../../state/features/class_group_slice"


import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/text-area';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import type { GridDragStartEvent } from '@vaadin/grid';
import { dialogFooterRenderer, dialogRenderer } from '@vaadin/dialog/lit.js';
import type { DialogOpenedChangedEvent } from '@vaadin/dialog';
import { UserInfo } from "../../state/features/user_slice";
import { AssignmentGroupInfo, createAssignmentGroup } from "../../state/features/assignment_group_slice"
import { StudentTeamInfo } from "../../state/features/student_team_slice";

@customElement("dwengo-assignment-list")
class AssignmentList extends connect(store)(LitElement){
    @property() classGroupUUID: string= ""

    @state() showCreateDialog: boolean = false

    @state() newAssignmentGroupInfo: AssignmentGroupInfo = {
        name: "",
        description: "",
        starred: false,
        studentTeams: [],
        inClassGroupUUID: this.classGroupUUID
    }

    @state() assignmentGroups: AssignmentGroupInfo[] = []

    @state() students: UserInfo[] = []
    @state() draggedItem?: UserInfo
    @state() studentTeams: StudentTeamInfo[] = []

    // Using -1 as null value since null and 0 conflict
    private draggedItemSourceIndex: number = -1

    stateChanged(state: any): void {
        if (state.classGroup?.currentGroup?.students){
            this.students = structuredClone(state.classGroup.currentGroup.students)
        }
        
    }

    connectedCallback() {
        super.connectedCallback()
        if (this.classGroupUUID){
            store.dispatch(getClassGroup(this.classGroupUUID))
        }
    }

    private createTeam(name) {
        let team: StudentTeamInfo = {
            name: name,
            students: []
        }
        this.studentTeams = [...this.studentTeams, team]
    }

    renderHeader(){
        return html`
        <div class="header">
            <h1>${msg("Assignments")}</h1>
            <h1>
                <vaadin-button theme="primary" @click="${() => {this.showCreateDialog = true}}">
                    <span>
                        ${msg("Create assignment")}
                    </span>
                </vaadin-button>
            </h1>
        </div>
        `
    }


    private saveStudentTeams = () => {
        this.newAssignmentGroupInfo.studentTeams = this.studentTeams.filter((element, i) => {return (i > 0 ? true : false)})
        this.newAssignmentGroupInfo.inClassGroupUUID = this.classGroupUUID
        store.dispatch(createAssignmentGroup(this.newAssignmentGroupInfo))
    }
    
      private clearDraggedItem = () => {
        this.draggedItemSourceIndex = -1  // If dragging from student list use index -1 since not in list of student teams
        delete this.draggedItem;
      };

      private renderCreateDialogDraggableGrid(team, index) {
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

      private renderCreateDialogDraggableGridDeleteButton(team, index) {
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

      /* THIS FUNCTION IS UGLY!
         Style tags are needed to 
         Should look into abstracting out the drop event handler
         However, this is not trivial since parameterizing the sources and destination lists looses the reference to the observed state field.
         Consequently, changes to these do not trigger an update.*/
    renderDialogContent() {
        return html`
        ${this.renderDialogStyle()}
        <div><vaadin-text-field @change=${(e) => this.newAssignmentGroupInfo.name = e.target.value } outlined label="${msg("Name")}" type="text"></vaadin-text-field></div>
        <div><vaadin-text-area @change=${(e) => this.newAssignmentGroupInfo.description = e.target.value } outlined label="${msg("Description")}"></vaadin-text-area></div>
        <div class="manual_group_creation_view">
            <div class="students_list_container list_container">
                ${this.studentTeams.length > 0 ? this.renderCreateDialogDraggableGrid(this.studentTeams[0], 0) : ""}
            </div>
            <div class="students_teams_list_container list_container">
                ${this.studentTeams.filter((element, i) => {return (i > 0 ? true : false)}).map((team, index) => {
                    return html`
                    <div class="teamcontainer">
                        ${this.renderCreateDialogDraggableGrid(team, index+1)}
                        ${this.renderCreateDialogDraggableGridDeleteButton(team, index+1)}
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
        this.showCreateDialog = false;
    }

    renderDialogFooter() {
        return html`
            <vaadin-button @click="${this.close}">${msg("Cancel")}</vaadin-button>
            <vaadin-button theme="primary" @click="${this.saveStudentTeams}">${msg("Create")}</vaadin-button>
        `
    }

    renderCreateDialog(){
        // Add the students in this class to the first student team (= frow which to pick)
        return html`
        <vaadin-dialog
            resizable
            theme="primary"
            draggable
            header-title="${msg("Create assignment")}"
            .opened="${this.showCreateDialog}"
            @opened-changed="${(event: DialogOpenedChangedEvent) => {
                this.showCreateDialog = event.detail.value;
                // Set initial value when dialog is opened
                if (this.showCreateDialog){
                    this.studentTeams = [
                        {
                            name: "class",
                            students: [...this.students]
                        }
                    ]
                }
            }}"
            ${dialogRenderer(this.renderDialogContent, [this.students, this.studentTeams])}
            ${dialogFooterRenderer(this.renderDialogFooter, [])}
        ></vaadin-dialog>
        `
    }

    protected render() {
            return html`
                ${getGoogleMateriaIconsLinkTag()}
                ${this.renderHeader()}
                ${this.renderCreateDialog()}
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