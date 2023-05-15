/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state, query} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { noselect } from "../../../styles/shared";
import { connectPortfolioItemsInCurrentPortfolio, deletePortfolioItem, PortfolioItemInfo } from "../../../state/features/portfolio_slice";
import { buttonStyles, iconStyle } from "../../../styles/shared";
import { UserInfo, initialUserState } from "../../../state/features/user_slice";
import { ClassGroups } from "../../../state/features/class_group_slice";
import { SavedProgramInfo } from "../../../state/features/saved_programs_slice";
import { StudentClassGroupInfo } from "../../../state/features/student_class_group_slice";
import { NotificationMessageType, setNotificationMessage } from "../../../state/features/notification_slice";

@customElement("dwengo-graph-portfolio-item")
class PortfolioItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: PortfolioItemInfo | null = null 
    @property({type: String})
    portfolioUUID = ""
    @property()
    userInfo: UserInfo = store.getState().user
    @query(".item_detail_modal")
    itemDetailModal!: HTMLDialogElement

    private itemToIconMap = {
        "TextItem": "text_fields",
        "BlocklyProgSequenceItem": "code_blocks",
        "SocialRobotDesignItem": "draw",
        "default": "unknown_med"
    }

    private itemToTitleMap = {
        "TextItem": msg("Markdown text"),
        "BlocklyProgSequenceItem": msg("Blockly code"),
        "SocialRobotDesignItem": msg("Social robot design"),
        "default": msg("Portfolio item")
    }

    @state()
    over: Boolean = false;

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        super.firstUpdated(_changedProperties);
        this.itemDetailModal.addEventListener("click", (e) => {
            if(e.target === this.itemDetailModal){
                this.itemDetailModal.close()
            }
        })
        this.itemDetailModal.addEventListener("touchstart", (e) => {
            if(e.target === this.itemDetailModal){
                this.itemDetailModal.close()
            }
        })
    }

    mapItemToElement(){
        const itemType: string = this.item?.__t || ""
        switch(itemType){
            case "TextItem":
                return html`<dwengo-portfolio-text-item .portfolioUUID=${this.portfolioUUID} .item=${this.item}></dwengo-portfolio-text-item>`
            case "BlocklyProgSequenceItem":
                return html`<dwengo-portfolio-blockly-code-item .portfolioUUID=${this.portfolioUUID} .item=${this.item}></dwengo-portfolio-blockly-code-item>`
            case "SocialRobotDesignItem":
                return html`<dwengo-portfolio-socialrobot-design-item .portfolioUUID=${this.portfolioUUID} .item=${this.item}></dwengo-portfolio-socialrobot-design-item>`
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    protected render() {
        return html`
            <div class="item_container noselect">
                ${getGoogleMateriaIconsLinkTag()}
                <div class="item_header">
                    <span class="material-symbols-outlined portfolio_item_handle"
                        @touchstart=${e => {
                            e.preventDefault()
                            console.log("touched drag handle")
                            this.onMouseDown(e)
                        }}
                        @touchend=${e => {
                            e.preventDefault()
                            console.log("stopped touching drag handle")
                            this.onMouseUp(e)
                        }}
                        @mousedown=${this.onMouseDown}>
                        drag_indicator
                    </span>
                   ${this.renderConnectionTarget()}
                </div>
                <div class="item_content">
                    <span 
                        title="${this.itemToTitleMap[this.item?.__t || "default"]}"
                        class="material-symbols-outlined dwengo-icon dwengo-clickable-icon overview_icon"
                        @touchstart=${this.handleItemDetailClick}
                        @click=${this.handleItemDetailClick}>
                            ${this.itemToIconMap[this.item?.__t || "default"]}
                    </span>
                </div>
            </div>
            ${this.renderItemDetailModal()}
            
        `
    }

    renderConnectionTarget() {
        return html`
            <span 
                title="${msg("Drag to connect")}"
                draggable="true"
                @dragstart=${this.onConnectionDragStart}
                @dragend=${this.onConnectionDragStop}
                @dragover=${ e => {
                    e.preventDefault();
                    return false
                }}
                @drag=${e => {
                    this.onConnectionDrag(e)
                }}
                @dragleave=${e => {
                    this.over = false
                    console.log("Leave");
                }}
                @dragenter=${e => {
                    this.over = true
                    console.log("Enter");
                }}
                @drop=${this.onConnectionDragDrop}
                class="material-symbols-outlined dwengo-icon drag-target ${this.over ? "over" : ""}">
                    adjust
            </span>
        `
    }

    handleItemDetailClick(e){
        const itemType: string = this.item?.__t || ""
        switch(itemType){
            case "TextItem":
            case "BlocklyProgSequenceItem":
                this.itemDetailModal.showModal()
                break
            case "SocialRobotDesignItem":
                console.log("Not supported yet")
                break
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    renderItemDetailModal(){
        return html`
            <dialog class="item_detail_modal">
                <div class="dialog_content_container">
                    <div class="dialog_header">
                        <form method="dialog">
                            <button type="submit" @touchend=${_ => this.itemDetailModal.close()} autofocus class="dwengo-button">
                                <span class="dwengo-button-icon material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </form>
                    </div>
                    <div class="dialog_content">
                        ${this.mapItemToElement()}
                    </div>
                </div>
                
                
            </dialog>`
    }

    onConnectionDragStart(e){
        e.dataTransfer.effectAllowed = "link";
        e.dataTransfer.setData("text/plain", JSON.stringify(this.item?.uuid));
        this.dispatchEvent(
            new CustomEvent(
                "connectionDragStarted", 
                {
                    bubbles: true,
                    composed: true,
                    detail: { dragStartX: e.clientX, dragStartY: e.clientY}
                }
            )
        )
    }

    onConnectionDrag(e){
        this.dispatchEvent(
            new CustomEvent(
                "connectionDragging",
                {
                    bubbles: true,
                    composed: true,
                    detail: { dragX: e.clientX, dragY: e.clientY }
                }
            )
        )
    }

    onConnectionDragStop(e) {
        this.dispatchEvent(
            new CustomEvent(
                "connectionDragStopped",
                {
                    bubbles: true,
                    composed: true,
                    detail: { dragStopX: e.clientX, dragStopY: e.clientY }
                }
            )
        )
    }

    onConnectionDragDrop(e) {
        e.preventDefault()
        e.stopPropagation()
        let fromItemUUID = JSON.parse(e.dataTransfer.getData("text/plain"))
        console.log("From UUID: " + fromItemUUID)
        console.log("To UUID: " + this.item?.uuid)
        this.over = false;
        // Check if item is not dropped on itself
        if (!this.item?.uuid) {
            store.dispatch(setNotificationMessage(msg("Error connecting items."), NotificationMessageType.ERROR, 5000))
        } else if (fromItemUUID === this.item?.uuid) {
            store.dispatch(setNotificationMessage(msg("Cannot connect item to itself."),NotificationMessageType.MESSAGE, 2000))
        } else {
            this.dispatchEvent(
                new CustomEvent(
                    "connectionDragDrop",
                    {
                        bubbles: true,
                        composed: true,
                        detail: { fromItemUUID: fromItemUUID, toItemUUID: this.item?.uuid }
                    }
                )
            )
            store.dispatch(connectPortfolioItemsInCurrentPortfolio(fromItemUUID, this.item?.uuid))
        }
        return false
    }

    onMouseDown(e){
        this.dispatchEvent(
            new CustomEvent(
                "dragHandlerMouseDown", 
                {
                    bubbles: true, 
                    composed: true, 
                    detail: {offsetX: e.offsetX, offsetY: e.offsetY}
                }
            )
        )
    }

    onMouseUp(e) {
        this.dispatchEvent(
            new CustomEvent(
                "dragHandlerMouseUp",
                {
                    bubbles: true,
                    composed: true,
                    detail: {offsetX: e.offsetX, offsetY: e.offsetY}
                }
            )
        )
    }

    static styles: CSSResultGroup = [css`

        .item_container {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .item_detail_modal {
            padding: 0;
        }
        .portfolio_item_handle {
            cursor: move;
        }
        .dialog_content_container {
            min-width: 60vw;
            margin: 1rem;
        }
        .dialog_header {
            display: flex;
            justify-content: flex-end;
            width: calc(100% - 2rem);
            height: 35px;
        }
        .drag-target {
            cursor: crosshair;
            z-index: 10;
            position: relative;
        }
        .item_content {
            display: flex;
            flex-grow: 1;
            justify-content: center;
            align-items: stretch;
        }
        .overview_icon {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 52px;
        }
        .over {
            color: red !important;
        }
        `, noselect, buttonStyles, iconStyle]

}

export { PortfolioItem }