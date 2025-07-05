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
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'admin', 'superadmin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
