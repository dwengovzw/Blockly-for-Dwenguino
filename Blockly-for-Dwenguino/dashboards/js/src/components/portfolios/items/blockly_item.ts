/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { localized, msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { BlocklyProgSequenceItemInfo } from "../../../state/features/portfolio_slice";
import * as Blockly from "blockly"
import {ref, Ref, createRef} from 'lit/directives/ref.js';

@localized()
@customElement("dwengo-portfolio-blockly-code-item")
class DwengoPortfolioBlocklyCodeItem extends connect(store)(LitElement) {
    @property({type: Object})
    item: BlocklyProgSequenceItemInfo | null = null
    @property({type: String}) portfolioUUID = ""

    formRef: Ref<HTMLFormElement> = createRef<HTMLFormElement>();
    targetRef: Ref<HTMLElement> = createRef<HTMLElement>();

    workspace: any = null;

    firstUpdated() {
        this.formRef.value?.submit();
    }

    protected render() {
        return html`
            <div class="portfolio_item portfolio_blockly_code_item">
                <form ${ref(this.formRef)} action="${globalSettings.hostname}/portfolioitem" id="blockly_form" method="post" target="blockly_container">
                    <input name="xml" type="hidden" value='${this.item?.eventSequence[0].data}'>
                </form>
                <iframe class="blockly_iframe" name="blockly_container" ${ref(this.targetRef)}></iframe>
            </div>
        `       
    }

    static styles?: CSSResultGroup = css`
        .blockly_iframe{
            display: inline-block;
            width: 100%;
            min-width: 400px;
            height: 400px;
        }
    `

}

export { DwengoPortfolioBlocklyCodeItem }