import { NextResponse } from 'next/server';
import Leave from '../../../../../models/leave';
import { dbConnect } from '../../../components/lib/dbconnect';
import { getUserFromRequest } from '../../../components/lib/getUserFromRequest';

export async function DELETE(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const leave = await Leave.findById(id);
    if (!leave) {
        return NextResponse.json({ error: 'Leave not found' }, { status: 404 });
    }

    if (leave.applicant.toString() !== token.id) {
        return NextResponse.json(
            { error: 'You can only delete your own leave requests' },
            { status: 403 }
        );
    }

    const deletedLeave = await Leave.findByIdAndDelete(id);
    if (!deletedLeave) {
        return NextResponse.json({error:'Failed to delete leave request'},{status:500})
    }

    return NextResponse.json({ success: true, deletedLeave }, { status: 200 });
}
