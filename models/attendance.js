import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, required: true },
        inTime: String,
        outTime: String,
        status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
    },
    { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
