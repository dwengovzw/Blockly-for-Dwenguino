import { LitElement, css, html, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, state, property } from "lit/decorators.js"; // needs .js to transpile
import { Router } from "@lit-labs/router"
import { store } from  "../../state/store"
import { connect } from "pwa-helpers"
import { localized, msg } from '@lit/localize';
import { SavedStateInfo, getAllSavedStates, deleteSavedState, updateSavedStateName } from "../../state/features/saved_state_slice"
import { getGoogleMateriaIconsLinkTag } from "../../util"

import '@vaadin/button';
import '@vaadin/grid';
import '@vaadin/text-field';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import "@material/mwc-button"
import '@vaadin/grid/vaadin-grid-sort-column.js';
import "@material/mwc-dialog"
import { getLocale } from "../../localization/localization";

@localized()
@customElement("dwengo-saved-programs-list")
class SavedProgramsList extends connect(store)(LitElement){

    constructor(){
        super()
        store.dispatch(getAllSavedStates())
    }

    @property({type: Object}) savedPrograms: SavedStateInfo[] = []
    @state() showConfirmDialog: boolean = false
    @state() itemSelectedToDelete: SavedStateInfo | null = null

    handleOpenSavedProgram(uuid: string){
        window.open(`${globalSettings.hostname}/savedstates/open?uuid=${uuid}&lang=${getLocale()}`, "_blank")
    }

    handleRemoveSavedProgram(uuid: string){
        store.dispatch(deleteSavedState(uuid))
    }

    renderConfirmDialog(name: string, uuid: string){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}" @closed=${_ => this.showConfirmDialog = false}>
            <div>
                ${msg("Are you sure you want to delete the item ")}<em>${name}</em>?
            </div>
            <mwc-button @click="${() => {this.handleRemoveSavedProgram(uuid)}}" slot="primaryAction" dialogAction="close">
                ${msg("Yes")}
            </mwc-button>
            <mwc-button @click="${() => {this.showConfirmDialog = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </mwc-button>
        </mwc-dialog>
        `
    }

    protected render() {
        return html`
        ${getGoogleMateriaIconsLinkTag()}
        <h1>${msg("Your saved projects")}<h1>
        <vaadin-grid .items="${this.savedPrograms}">
            <vaadin-grid-sort-column 
                flex-grow="1" 
                header="${msg("Project name")}" 
                auto-width
                ${columnBodyRenderer(
                    (savedProgram: SavedStateInfo) => html`
                    <vaadin-text-field 
                        class="edit_on_focus" 
                        value="${savedProgram.name}" 
                        min-length="1"
                        @value-changed=${(e)=>{
                            savedProgram.name = e.detail.value
                        }}
                        @focusout=${(e)=>{
                            store.dispatch(updateSavedStateName(savedProgram))
                        }}>
                    </vaadin-text-field>
                    `,
                    []
                )}
            ></vaadin-grid-sort-column>


            <vaadin-grid-sort-column 
                flex-grow="0" 
                header="${msg("Saved at")}" 
                auto-width
                ${columnBodyRenderer(
                    (savedProgram: SavedStateInfo) => html`
                        ${new Date(Date.parse(savedProgram.savedAt)).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        })}
                    `,
                    []
                )}
            ></vaadin-grid-sort-column>
            <vaadin-grid-column
            frozen-to-end
            auto-width
            flex-grow="0"
            ${columnBodyRenderer(
                (savedProgram: SavedStateInfo) => html`
                    <mwc-button title=${msg("Open")} class="item" @click=${() => this.handleOpenSavedProgram(savedProgram.uuid)} raised>
                    <span class="material-symbols-outlined">
                        open_in_new
                    </span>
                    </mwc-button>`,
                []
            )}
            ></vaadin-grid-column>
            <vaadin-grid-column
            frozen-to-end
            auto-width
            flex-grow="0"
            ${columnBodyRenderer(
                (savedProgram: SavedStateInfo) => html`
                    <mwc-button title=${msg("Delete")} class="item" @click="${() => {this.itemSelectedToDelete = savedProgram; this.showConfirmDialog = true}}" raised>
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                    </mwc-button>`,
                []
            )}
            >test</vaadin-grid-column>
        </vaadin-grid>
        ${this.showConfirmDialog && this.itemSelectedToDelete ? this.renderConfirmDialog(this.itemSelectedToDelete?.name, this.itemSelectedToDelete?.uuid) : ""}`
    }

    static styles?: CSSResultGroup = css`
        mwc-button {
            --mdc-theme-primary: var(--theme-accentFillSelected);
            min-width: 40px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin: 0.5rem;
        }
        vaadin-grid::part(even-row) {
            background-color: var(--theme-neutralFillRest);
        }

        vaadin-text-field::part(input-field) {
            border: none;
            background-color: transparent;
        }

        vaadin-text-field[focused]::part(input-field) {
            border-radius: var(--vaadin-input-field-border-radius, 0px);
            background-color: var(--lumo-contrast-10pct);
        }

        vaadin-grid-cell-content {
            display: flex;
        }
    `

}

export default SavedProgramsList