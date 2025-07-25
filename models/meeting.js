import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        project: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
        status: {
            type: String,
            enum: ['upcoming', 'cancelled', 'completed'],
            default: 'upcoming',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        meetingLink: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);
