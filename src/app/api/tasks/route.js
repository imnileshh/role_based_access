import Task from '../../../../models/task';
import User from '../../../../models/user';
import { dbConnect } from '../../components/lib/dbconnect';
import { getUserFromRequest } from '../../components/lib/getUserFromRequest';
export async function POST(req) {
    await dbConnect();
    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { title, description, dueDate, assignedTo, status, project } = await req.json();

    if (!title || !assignedTo) {
        console.log('failed creating Task');

        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const assignedUser = await User.findOne({ name: assignedTo });
    if (!assignedUser) {
        return NextResponse.json({ error: `User '${assignedTo}' not found` }, { status: 404 });
    }
    // const projectData = await Project.findOne({ name: project });
    const newTask = await Task.create({
        title,
        description,
        dueDate,
        assignedTo: assignedUser._id,
        createdBy: token.id,
        status: status || 'pending',
        project,
    });

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
}

export async function GET(req) {
    await dbConnect();
    const token = await getUserFromRequest(req);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('token is :', token);
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    // const user = await User.findOne({ name: createdBy });
    // if (!user) {
    //     console.log('user not found');
    // }
    let filter = {
        $or: [{ assignedTo: token.id }, { createdBy: token.id }],
    };

    if (projectId) {
        filter.project = projectId;
    }

    const tasks = await Task.find(filter)
        .populate('assignedTo')
        .populate('createdBy')
        .populate('project');

    // let tasks;
    // if (user) {
    //     tasks = await Task.find({ createdBy: user._id })
    //         .populate('assignedTo')
    //         .populate('createdBy');
    // } else {
    //     tasks = await Task.find({ assignedTo: token.id })
    //         .populate('assignedTo')
    //         .populate('createdBy');
    // }

    return NextResponse.json({ tasks });
}
