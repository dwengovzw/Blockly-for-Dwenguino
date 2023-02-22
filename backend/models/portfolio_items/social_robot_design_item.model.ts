import { Document, Schema, Model } from "mongoose"
import { PortfolioItem } from "./portfolio_item.model.js"
import { ISolutionItem, SolutionItemSchema } from "./solution_item.model.js"

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
const SocialRobotDesignItemSchema = SolutionItemSchema(SocialRobotDesignItemSchemaFields)
interface ISocialRobotDesignItemModel extends Model<ISocialRobotDesignItem>{}
const SocialRobotDesignItem = PortfolioItem.discriminator<ISocialRobotDesignItem, ISocialRobotDesignItemModel>('SocialRobotDesignItem', SocialRobotDesignItemSchema)

export {
    ISocialRobotDesignItem,
    SocialRobotDesignItem
}