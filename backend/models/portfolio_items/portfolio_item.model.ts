import { Document, Schema, model } from "mongoose"

interface IPortfolioItem {
    name: string
}
const PortfolioItemFields: Record<keyof IPortfolioItem, any> = {
    name: String
}
const PortfolioItemSchema = new Schema<IPortfolioItem>(PortfolioItemFields)
const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema)

export {
    IPortfolioItem,
    PortfolioItem
}