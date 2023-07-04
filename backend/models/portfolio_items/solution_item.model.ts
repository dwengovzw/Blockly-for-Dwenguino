import { Document, Schema, Model } from "mongoose"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model"

interface ISolutionItemExtraFields {
}
interface ISolutionItem extends IPortfolioItem, ISolutionItemExtraFields {}
const SolutionSchemaFields: Record<keyof ISolutionItemExtraFields, any> = {
    
}

let SolutionItemSchema = (props) => {
    const params = SolutionSchemaFields
    if(props) Object.assign(params, props);
	return new Schema(params);
}

export {
    ISolutionItem,
    SolutionItemSchema
}