import { NextResponse } from 'next/server';
import Leave from '../../../../models/leave';
import { dbConnect } from '../../components/lib/dbconnect';
import { getUserFromRequest } from '../../components/lib/getUserFromRequest';

export async function POST(req) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, reason, leaveType } = await req.json();
    if (!leaveType || !startDate || !endDate || !reason) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
        return NextResponse.json({ error: 'Start date cannot be after end date' }, { status: 400 });
    }

    const leaveData = await Leave.create({
        applicant: token._id,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
    });
    return NextResponse.json({ success: true, leave: leaveData }, { status: 201 });
}

export async function GET(req) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leaves = await Leave.find({});

    return NextResponse.json({ success: true, leaves }, { status: 200 });
}
