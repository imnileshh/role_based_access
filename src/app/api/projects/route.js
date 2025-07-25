import Project from '../../../../models/projects';
import dbConnect from '../../../lib/dbconnect';
import { getUserFromRequest } from '../../../lib/getUserFromRequest';

export async function POST(req) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
        return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newProject = await Project.create({
        name,
        description,
        createdBy: token.id,
    });
    return Response.json({ success: true, project: newProject }, { status: 201 });
}

export async function GET(req, { params }) {
    await dbConnect();

    const token = await getUserFromRequest(req);
    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // const url = new URL(req.url);
    // const projectId = url.searchParams.get('projectId');

    const projects = await Project.find({});
    // console.log('projects are :', projects);

    return Response.json({ projects });
}
