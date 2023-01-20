import { Schema } from "mongoose";
import { SolutionItem } from "./solution_item.model.js";
import { LogItemSchema } from '../logitem.model.js';
const BlocklyProgSequenceItemSchemaFields = {
    eventSequence: [LogItemSchema]
};
const BlocklyProgSequenceItemSchema = new Schema(BlocklyProgSequenceItemSchemaFields);
const BlocklyProgSequenceItem = SolutionItem.discriminator('BlocklyProgSequenceItem', BlocklyProgSequenceItemSchema);
export { BlocklyProgSequenceItem };
//# sourceMappingURL=blockly_programming_sequence.model.js.map