import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false,
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'admin', 'superadmin'],
            default: 'user',
        },
        leaveStats: {
            paid: {
                total: {
                    type: Number,
                    default: 20,
                },
                used: {
                    type: Number,
                    default: 0,
                },
            },
            sick: {
                total: {
                    type: Number,
                    default: 14,
                },
                used: {
                    type: Number,
                    default: 0,
                },
            },
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
