/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { SocialRobotDesignItemInfo } from "../../../state/features/portfolio_slice";
import { Ref, ref, createRef } from "lit/directives/ref.js"

@customElement("dwengo-portfolio-socialrobot-design-item")
class DwengoPortfolioSocialRobotDesignItem extends connect(store)(LitElement) {
    @property({type: Object})
    item: SocialRobotDesignItemInfo | null = null
    @property({type: String}) portfolioUUID = ""

    formRef: Ref<HTMLFormElement> = createRef<HTMLFormElement>();
    targetRef: Ref<HTMLElement> = createRef<HTMLElement>();

    constructor(){
        super();
    }

    firstUpdated() {
        this.formRef.value?.submit();
    }
        

    protected render() {
        return html`
        <span>${this.item?.socialRobotDesignXml}</span>
        <div class="portfolio_item portfolio_blockly_code_item">
            <form ${ref(this.formRef)} action="${globalSettings.hostname}/socialrobotreadonly" id="blockly_form" method="post" target="soc_robot_container">
                <input name="xml" type="hidden" value='${this.item?.socialRobotDesignXml}'>
            </form>
            <iframe class="blockly_iframe" name="soc_robot_container" ${ref(this.targetRef)}></iframe>
        </div>
        `       
    }

    static styles?: CSSResultGroup = css`
        
    `
}