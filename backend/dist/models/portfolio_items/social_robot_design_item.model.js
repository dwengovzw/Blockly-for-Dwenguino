import { Schema } from "mongoose";
import { SolutionItem } from "./solution_item.model.js";
const SocialRobotDesignItemSchemaFields = {
    socialRobotDesignXml: {
        type: String,
        required: true
    }
};
const SocialRobotDesignItemSchema = new Schema(SocialRobotDesignItemSchemaFields);
const SocialRobotDesignItem = SolutionItem.discriminator('SocialRobotDesignItem', SocialRobotDesignItemSchema);
export { SocialRobotDesignItem };
//# sourceMappingURL=social_robot_design_item.model.js.map