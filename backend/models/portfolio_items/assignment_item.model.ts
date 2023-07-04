import { Document, Schema, Model } from "mongoose"
import { IPortfolioItem, PortfolioItem } from "./portfolio_item.model"
import { PopulatedDoc } from 'mongoose';
import { IUser } from "../user.model";

interface IAssignmentItemExtraFields {
    ownedBy: PopulatedDoc<IUser>
}
interface IAssignmentItem extends IPortfolioItem, IAssignmentItemExtraFields {}
const AssignmentSchemaFields: Record<keyof IAssignmentItemExtraFields, any> = {
    ownedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}

let AssignmentItemSchema = (props) => {
    const params = AssignmentSchemaFields
    if (props) Object.assign(params, props);
    return new Schema(params)
}

export {
    IAssignmentItem,
    AssignmentItemSchema
}