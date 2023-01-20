import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface ISocialRobotDesignItemExtraFields {
    socialRobotDesignXml: string
}
interface ISocialRobotDesignItem extends ISolutionItem, ISocialRobotDesignItemExtraFields {}
interface ISocialRobotDesignItemDoc extends ISocialRobotDesignItem, Document {}
const SocialRobotDesignItemSchemaFields: Record<keyof ISocialRobotDesignItemExtraFields, any> = {
    socialRobotDesignXml: {
        type: String,
        required: true
    }
}
const SocialRobotDesignItemSchema = new Schema(SocialRobotDesignItemSchemaFields)
interface ISocialRobotDesignItemModel extends Model<ISocialRobotDesignItemDoc>{}
const SocialRobotDesignItem = SolutionItem.discriminator<ISocialRobotDesignItemDoc, ISocialRobotDesignItemModel>('SocialRobotDesignItem', SocialRobotDesignItemSchema)

export {
    ISocialRobotDesignItem,
    ISocialRobotDesignItemDoc,
    SocialRobotDesignItem
}