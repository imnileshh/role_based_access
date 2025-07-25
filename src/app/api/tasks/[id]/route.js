import Task from '../../../../../models/task';
import dbConnect from '../../../../lib/dbconnect';
import { getUserFromRequest } from '../../../../lib/getUserFromRequest';

export async function PATCH(req, { params }) {
    await dbConnect();
    const token = await getUserFromRequest(req);
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const updates = await req.json();

    const task = await Task.findById(id);
    if (!task) {
        return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    const createdById = task.createdBy?.toString();

    const assignedToId = task.assignedTo?.toString();

    if (assignedToId !== token.id && createdById !== token.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    return Response.json({ success: true, task: updatedTask });
}
