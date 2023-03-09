import { LitElement, css, html, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { Router } from "@lit-labs/router"
import { store } from  "../../state/store"
import { connect } from "pwa-helpers"
import { msg } from '@lit/localize';
import { SavedProgramInfo, getAllSavedPrograms, deleteSavedProgram } from "../../state/features/saved_programs_slice"
import { getGoogleMateriaIconsLinkTag } from "../../util"

import '@vaadin/button';
import '@vaadin/grid';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import "@material/mwc-button"
import '@vaadin/grid/vaadin-grid-sort-column.js';
import "@material/mwc-dialog"

@customElement("dwengo-saved-programs-list")
class SavedProgramsList extends connect(store)(LitElement){

    constructor(){
        super()
        store.dispatch(getAllSavedPrograms())
    }

    @state() savedPrograms: SavedProgramInfo[] = []
    @state() showConfirmDialog: boolean = false
    @state() itemSelectedToDelete: SavedProgramInfo | null = null

    stateChanged(state: any): void {
        if (state.savedPrograms){
            this.savedPrograms = structuredClone(state.savedPrograms.programs)
        }
        
    }

    handleOpenSavedProgram(uuid: string){
        window.open(`${globalSettings.hostname}/savedprograms/open?uuid=${uuid}`, "_blank")
    }

    handleRemoveSavedProgram(uuid: string){
        store.dispatch(deleteSavedProgram(uuid))
    }

    renderConfirmDialog(name: string, uuid: string){
        return html`
        <mwc-dialog open="${this.showConfirmDialog}">
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
        <vaadin-grid .items="${this.savedPrograms}">
            <vaadin-grid-sort-column
                frozen
                header="${msg("Filename")}"
                auto-width
                flex-grow="1"
                path="name"
                >
            </vaadin-grid-sort-column>
            <vaadin-grid-sort-column flex-grow="0" header="${msg("Saved at")}" path="savedAt" auto-width></vaadin-grid-sort-column>
            <vaadin-grid-column
            frozen-to-end
            auto-width
            flex-grow="0"
            ${columnBodyRenderer(
                (savedProgram: SavedProgramInfo) => html`
                    <mwc-button class="item" @click=${() => this.handleOpenSavedProgram(savedProgram.uuid)} raised>
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
                (savedProgram: SavedProgramInfo) => html`
                    <mwc-button class="item" @click="${() => {this.itemSelectedToDelete = savedProgram; this.showConfirmDialog = true}}" raised>
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
            min-width: 50px;
        }
        vaadin-grid::part(even-row) {
            background-color: var(--theme-neutralFillRest);
        }
    `

}

export default SavedProgramsList