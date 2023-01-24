import { Schema, model } from "mongoose"
import { ID } from "./modelutils.js"
import { v4 as uuidv4 } from 'uuid'
import { ITeacher } from "./user.model.js";
import { IPortfolioItem } from "./portfolio_items/portfolio_item.model.js";

interface IPortfolio {
    created: Date,
    lastEdited: Date,
    name: string,
    description?: string,
    sharedWith?: ID[] | ITeacher[],
    isPublic: boolean,
    publicId: string,
    folder?: string,
    items: ID[] | IPortfolioItem[]
}
const PortfolioFields: Record<keyof IPortfolio, any> = {
    created: {
        type: Date,
        required: true
    },
    lastEdited: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    sharedWith:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Teacher'
        }
    ],
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    },
    publicId: {      // UUID (different from the automatically generated _id)
        type: String,
        required: true,
        default: uuidv4, // Use automatically generated uuid as identifier (unique in combination with version and language)
    },
    folder: {
        type: String
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'PortfolioItem'
        }
    ]
}
const PortfolioSchema = new Schema<IPortfolio>(PortfolioFields)
const Portfolio = model<IPortfolio>('Portfolio', PortfolioSchema)

export {
    IPortfolio,
    Portfolio
}