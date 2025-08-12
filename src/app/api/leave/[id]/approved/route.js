import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Leave from '../../../../../../models/leave';
import User from '../../../../../../models/user';
import { dbConnect } from '../../../../components/lib/dbconnect';
import { getUserFromRequest } from '../../../../components/lib/getUserFromRequest';

export async function PATCH(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token || token.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const leave = await Leave.findById(id).session(session);
        if (!leave) {
            return NextResponse.json({ error: 'Leave not found' }, { status: 404 });
        }

        if (leave.status !== 'pending') {
            return NextResponse.json({ error: 'Leave is not pending' }, { status: 400 });
        }

        const user = await User.findById(leave.applicant).session(session);
        if (!user) {
            return NextResponse.json({ error: 'user not found' }, { status: 404 });
        }

        const usedLeaves = leave.numberOfDays;
        let type = leave.leaveType;
        //  update leave days
        user.leaveStats[type].used += usedLeaves;
        await user.save({ session });

        // update leave status
        leave.status = 'approved';
        await leave.save({ session });

        await session.commitTransaction();
        return NextResponse.json({ success: true, leave, user }, { status: 200 });
    } catch (error) {
        await session.abortTransaction();
        return NextResponse.json({ error }, { status: 500 });
    } finally {
        session.endSession();
    }
}
