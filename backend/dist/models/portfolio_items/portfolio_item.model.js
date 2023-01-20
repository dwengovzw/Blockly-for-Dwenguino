import { Schema, model } from "mongoose";
const PortfolioItemFields = {
    name: String
};
const PortfolioItemSchema = new Schema(PortfolioItemFields);
const PortfolioItem = model('PortfolioItem', PortfolioItemSchema);
export { PortfolioItem };
//# sourceMappingURL=portfolio_item.model.js.map