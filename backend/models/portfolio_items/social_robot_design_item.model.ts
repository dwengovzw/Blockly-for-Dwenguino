import { Document, Schema, Model } from "mongoose"
import { ISolutionItem, SolutionItem } from "./solution_item.model.js"

interface ISocialRobotDesignItemExtraFields {
    socialRobotDesignXml: string
}
interface ISocialRobotDesignItem extends ISolutionItem, ISocialRobotDesignItemExtraFields {}
const SocialRobotDesignItemSchemaFields: Record<keyof ISocialRobotDesignItemExtraFields, any> = {
    socialRobotDesignXml: {
        type: String,
        required: true
    }
}
const SocialRobotDesignItemSchema = new Schema<ISocialRobotDesignItem>(SocialRobotDesignItemSchemaFields)
interface ISocialRobotDesignItemModel extends Model<ISocialRobotDesignItem>{}
const SocialRobotDesignItem = SolutionItem.discriminator<ISocialRobotDesignItem, ISocialRobotDesignItemModel>('SocialRobotDesignItem', SocialRobotDesignItemSchema)

export {
    ISocialRobotDesignItem,
    SocialRobotDesignItem
}