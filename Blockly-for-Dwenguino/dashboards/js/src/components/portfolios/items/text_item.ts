/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { localized, msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { savePortfolioItem, TextItemInfo } from "../../../state/features/portfolio_slice";

import "../../util/md_editor"

@localized()
@customElement("dwengo-portfolio-text-item")
class PortfolioTextItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: TextItemInfo | null = null
    @property({type: String}) portfolioUUID = ""


    // This function counts the number of newlines in a string to determine the height of the textarea:
    // https://stackoverflow.com/questions/111591/how-to-count-the-number-of-lines-in-a-string
    countNewlines(str: string) {
        const lines = str.split("\n").length
        return lines > 3 ? lines : 3;
    }


    protected render() {
        return html`
            <div class="portfolio_text_item portfolio_item">
                <dwengo-md-editor 
                    value=${this.item?.mdText || ""}
                    @valueChanged=${(e: CustomEvent) => {
                        console.log(e);
                        if (this.item){
                            this.item.mdText = e.detail.value
                            this.item = {...this.item}
                            store.dispatch(savePortfolioItem(this.portfolioUUID, this.item))
                        }
                    }}
                    placeholder="${msg("Type your text here")}">
                </dwengo-md-editor>
            </div>
        `
    }


    static styles?: CSSResultGroup = css`
       .text_item_content {
            width: 90%;
            height: auto;
            resize: none;
            border: none;
            overflow: hidden;
            background-color: transparent;
            font-size: 1.5em;
            font-family: "Roboto", "Noto", sans-serif;
       }
       
    `

}

export { PortfolioTextItem }