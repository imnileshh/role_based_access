import { NextResponse } from 'next/server';
import Meeting from '../../../../../models/meeting';
import User from '../../../../../models/user';
import { dbConnect } from '../../../components/lib/dbconnect';
import { getUserFromRequest } from '../../../components/lib/getUserFromRequest';

export async function PATCH(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const updates = await req.json();

    const allParticipants = updates.participants;
    const meetingParticipants = await Promise.all(
        allParticipants.map(async participant => {
            const user = await User.findOne({ name: participant.label });
            return user?._id;
        })
    );

    updates.participants = meetingParticipants;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
        return NextResponse.json({ error: 'No Such Meeting Found' });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json({ success: true, updatedMeeting }, { status: 201 });
}

export async function DELETE(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const meeting = await Meeting.findById(id);
    if (meeting?.createdBy.toString() !== token.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletedMeeting = await Meeting.findByIdAndDelete(id);

    return NextResponse.json({ success: true, deletedMeeting }, { status: 201 });
}
