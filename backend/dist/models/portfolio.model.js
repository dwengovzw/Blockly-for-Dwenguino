import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const PortfolioFields = {
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
    sharedWith: [
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
    publicId: {
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
};
const PortfolioSchema = new Schema(PortfolioFields);
const Portfolio = model('Portfolio', PortfolioSchema);
export { Portfolio };
//# sourceMappingURL=portfolio.model.js.map