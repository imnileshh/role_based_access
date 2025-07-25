import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        dueDate: Date,
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'in Progress', 'completed'],
            default: 'pending',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
