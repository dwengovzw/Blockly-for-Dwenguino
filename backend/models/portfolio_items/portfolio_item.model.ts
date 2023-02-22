import { Document, Schema, model } from "mongoose"
import  v4 from "uuid/v4.js"

interface IPortfolioItem {
    uuid?: string,
    name: string
}
const PortfolioItemFields: Record<keyof IPortfolioItem, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    name: String
}
const PortfolioItemSchema = new Schema<IPortfolioItem>(PortfolioItemFields)
const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema)

export {
    IPortfolioItem,
    PortfolioItem
}