import { LitElement, css, html, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { Router } from "@lit-labs/router"
import { store } from  "../../state/store"
import { connect } from "pwa-helpers"
import { SavedProgramInfo, getAllSavedPrograms } from "../../state/features/saved_programs_slice"



@customElement("dwengo-saved-programs-list")
class SavedProgramsList extends connect(store)(LitElement){

    constructor(){
        super()
        store.dispatch(getAllSavedPrograms())
    }

    @state() savedPrograms: SavedProgramInfo[] = []

    stateChanged(state: any): void {
        if (state.savedPrograms){
            this.savedPrograms = structuredClone(state.savedPrograms.programs)
        }
        
    }

    protected render() {
        return html`
        <ul>
            ${this.savedPrograms.map(p => html`<li>${p.name}</li>`)}
        </ul>`
    }

}

export default SavedProgramsList