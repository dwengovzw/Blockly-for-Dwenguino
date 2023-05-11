import { Document, PopulatedDoc, Schema, model } from "mongoose"
import  v4 from "uuid/v4.js"


interface IPortfolioItemDisplayInformation {
    x: number,
    y: number,
    width: number,
    height: number,
}

const PortfolioItemDisplayInformationFields: Record<keyof IPortfolioItemDisplayInformation, any> = {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
}
const PortfolioItemDisplayInformationSchema = new Schema<IPortfolioItemDisplayInformation>(PortfolioItemDisplayInformationFields)

interface IPortfolioItem {
    uuid?: string,
    name: string,
    children: PopulatedDoc<IPortfolioItem>[] | IPortfolioItem[],
    displayInformation: IPortfolioItemDisplayInformation,
}

const PortfolioItemFields: Record<keyof IPortfolioItem, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    name: String,
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'PortfolioItem',
        default: [],
        required: true
    }],
    displayInformation: {
        type: PortfolioItemDisplayInformationSchema,
        default: {
            x: 0,
            y: 0,
            width: 100,
            height: 50,
        }
    }
}
const PortfolioItemSchema = new Schema<IPortfolioItem>(PortfolioItemFields)
const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema)

export {
    IPortfolioItem,
    PortfolioItem,
    IPortfolioItemDisplayInformation
}