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

@customElement("dwengo-portfolio-socialrobot-design-item")
class DwengoPortfolioSocialRobotDesignItem extends connect(store)(LitElement) {
    @property({type: Object})
    item: SocialRobotDesignItemInfo | null = null
    @property({type: String}) portfolioUUID = ""

    protected render() {
        return html`
            <div class="portfolio_item portfolio_socialrobot_design_item">
                <span>${this.item?.socialRobotDesignXml}</span>
            </div>
        `       
    }
}