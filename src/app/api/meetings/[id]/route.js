import Meeting from '../../../../../models/meeting';
import dbConnect from '../../../lib/dbconnect';
import { getUserFromRequest } from '../../../lib/getUserFromRequest';

export async function PATCH(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);

    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } =  params;
    const updates = await req.json();

    const meeting = await Meeting.findById(id);

    if (!meeting) {
        return Response.json({ error: 'No Such Meeting Found' });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(id, updates, { new: true });

    return Response.json({ success: true, updatedMeeting }, { status: 201 });
}

export async function DELETE(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const meeting = await Meeting.findById(id);
    if (meeting?.createdById.toString() !== token.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletedMeeting = await Meeting.findByIdAndDelete(id);

    return Response.json({ success: true, deletedMeeting }, { status: 201 });
}
