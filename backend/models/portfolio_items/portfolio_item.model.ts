import { Document, Schema, model } from "mongoose"

interface IPortfolioItem {
    name: string
}
interface IPortfolioItemDoc extends IPortfolioItem, Document {}
const PortfolioItemFields: Record<keyof IPortfolioItem, any> = {
    name: String
}
const PortfolioItemSchema = new Schema(PortfolioItemFields)
const PortfolioItem = model<IPortfolioItemDoc>('PortfolioItem', PortfolioItemSchema)

export {
    IPortfolioItem,
    IPortfolioItemDoc,
    PortfolioItem
}