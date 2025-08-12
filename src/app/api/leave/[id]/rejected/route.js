import { NextResponse } from 'next/server';
import Leave from '../../../../../../models/leave';
import { dbConnect } from '../../../../components/lib/dbconnect';
import { getUserFromRequest } from '../../../../components/lib/getUserFromRequest';

export async function PATCH(req, { params }) {
    await dbConnect();
    const token = await getUserFromRequest(req);

    if (!token || token.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const leave = await Leave.findById(id);
    if (!leave) {
        return NextResponse.json({ error: 'Leave Not Found ' }, { status: 404 });
    }

    if (leave.status !== 'pending') {
        return NextResponse.json({ error: 'Leave is not pending' }, { status: 400 });
    }

    leave.status = 'rejected';
    await leave.save();

    return NextResponse.json({ success: true, leave }, { status: 200 });
}
