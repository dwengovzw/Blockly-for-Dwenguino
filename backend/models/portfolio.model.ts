import { Schema, model } from "mongoose"
import  v4 from "uuid/v4"
import { IPortfolioItem } from "./portfolio_items/portfolio_item.model";
import { PopulatedDoc } from 'mongoose';
import { IUser } from "./user.model";

interface INewPortfolio {
    created: Date,
    lastEdited: Date,
    name: string,
    description?: string,
    sharedWith?: PopulatedDoc<IUser>[] | IUser[],
    isPublic: boolean,
    folder?: string,
    items: PopulatedDoc<IPortfolioItem>[] | IPortfolioItem[]
}

interface IPortfolio extends INewPortfolio {
    uuid: string,
}
const PortfolioFields: Record<keyof IPortfolio, any> = {
    uuid: {
        type: String,
        required: true,
        default: v4
    },
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
    lastEdited: {
        type: Date,
        required: true,
        default: new Date()
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    sharedWith:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isPublic: {
        type: Boolean,
        required: true,
        default: false
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
    Portfolio,
    INewPortfolio
}