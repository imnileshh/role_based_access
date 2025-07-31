import { NextResponse } from 'next/server';
import Task from '../../../../../models/task';
import User from '../../../../../models/user';
import { dbConnect } from '../../../components/lib/dbconnect';
import { getUserFromRequest } from '../../../components/lib/getUserFromRequest';

export async function PATCH(req, { params }) {
    await dbConnect();
    const token = await getUserFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const updates = await req.json();
    console.log('updates', updates);

    const assignedToUser = await User.findOne({ name: updates.assignedTo });
    updates.assignedTo = assignedToUser._id;

    const task = await Task.findById(id);
    if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const createdById = task.createdBy?.toString();

    const assignedToId = task.assignedTo?.toString();

    if (assignedToId !== token.id && createdById !== token.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json({ success: true, task: updatedTask });
}

export async function DELETE(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const task = await Task.findById(id);
    console.log(task.createdBy.toString(), token.id);
    if (task.createdBy.toString() !== token.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const deletedTask = await Task.findByIdAndDelete(id);

    return NextResponse.json({ success: true, deletedTask }, { status: 201 });
}
