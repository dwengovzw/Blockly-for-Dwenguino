import { Document, PopulatedDoc, Schema, model } from "mongoose"
import  v4 from "uuid/v4.js"


interface IMinimalPortfolioItemDisplayInformation {
    x: number,
    y: number,
}
interface IPortfolioItemDisplayInformation extends IMinimalPortfolioItemDisplayInformation{
    width?: number,
    height?: number,
}

const PortfolioItemDisplayInformationFields: Record<keyof IPortfolioItemDisplayInformation, any> = {
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        default: 68
    },
    height: {
        type: Number,
        default: 98
    },
}
const PortfolioItemDisplayInformationSchema = new Schema<IPortfolioItemDisplayInformation>(PortfolioItemDisplayInformationFields)

interface IPortfolioItem {
    uuid?: string,
    name: string,
    children: PopulatedDoc<IPortfolioItem>[] | IPortfolioItem[],
    displayInformation: IPortfolioItemDisplayInformation,
    needsTeacherAttention: boolean,
    needsStudentAttention: boolean,
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
        default: () => ({})
    },
    needsTeacherAttention: {
        type: Boolean,
        default: false
    },
    needsStudentAttention: {
        type: Boolean,
        default: false
    },
}
const PortfolioItemSchema = new Schema<IPortfolioItem>(PortfolioItemFields)
const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema)

export {
    IPortfolioItem,
    PortfolioItem,
    IPortfolioItemDisplayInformation
}