import mongoose, { Schema, Document } from 'mongoose';

interface Exercise {
    learningObjectId: {
        hruid: string;
        language: string;
        version: number;
    };
    solution: Record<string, unknown>;
}

interface LearningPathProgressItem extends Document {
    user: mongoose.Types.ObjectId;
    hruid: string;
    language: string;
    currentStep: {
        hruid: string;
        language: string;
        version: number;
    };
    exercises: Exercise[];
}

const LearningPathProgressItemSchema: Schema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hruid: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    currentStep: {
        hruid: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        version: {
            type: Number,
            required: true,
        },
    },
    exercises: [
        {
            learningObjectId: {
                hruid: {
                    type: String,
                    required: true,
                },
                language: {
                    type: String,
                    required: true,
                },
                version: {
                    type: Number,
                    required: true,
                },
            },
            solution: {
                type: Schema.Types.Mixed,
                required: true,
            },
        },
    ],
});

export default mongoose.model<LearningPathProgressItem>(
    'LearningPathProgressItem',
    LearningPathProgressItemSchema
);

export { LearningPathProgressItem, LearningPathProgressItemSchema, Exercise}