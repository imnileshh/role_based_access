import { NextResponse } from 'next/server';
import Leave from '../../../../models/leave';
import { default as User } from '../../../../models/user';
import calculateNumberOfLeaveDays from '../../components/lib/calculateNumberOfLeaveDays';
import { dbConnect } from '../../components/lib/dbconnect';
import { getUserFromRequest } from '../../components/lib/getUserFromRequest';
export async function POST(req) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, reason, leaveType, application } = await req.json();
    console.log('Received data:', { startDate, endDate, reason, leaveType, application });
    if (!leaveType || !startDate || !endDate || !reason || !application) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
        return NextResponse.json({ error: 'Start date cannot be after end date' }, { status: 400 });
    }
    const numberOfDays = calculateNumberOfLeaveDays(start, end);
    const leaveData = await Leave.create({
        applicant: token.id,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        numberOfDays,
        application,
    });
    return NextResponse.json({ success: true, leaveData }, { status: 201 });
}

export async function GET(req) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const name = searchParams.get('name');
    let user;
    if (name) {
        user = await User.findOne({ name });
    }
    const filter = {};
    if (status) filter.status = status;
    if (name) filter.applicant = user._id;

    const leaves = await Leave.find(filter).populate('applicant');

    return NextResponse.json({ success: true, leaves }, { status: 200 });
}
