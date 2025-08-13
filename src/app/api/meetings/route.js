import { NextResponse } from 'next/server';
import Meeting from '../../../../models/meeting';
import User from '../../../../models/user';
import { dbConnect } from '../../components/lib/dbconnect.js';
import { getUserFromRequest } from '../../components/lib/getUserFromRequest.js';

export async function GET(req) {
    await dbConnect();

    const token = await getUserFromRequest(req);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    console.log(projectId);

    const meetings = await Meeting.find({ project: projectId })
        .populate('participants')
        .populate('createdBy')
        .populate('project');

    return NextResponse.json({ meetings });
}

export async function POST(req) {
    await dbConnect();
    const token = await getUserFromRequest(req);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, date, participants, project, meetingLink } = await req.json();

    const participantsId = await Promise.all(
        participants.map(async participant => {
            const user = await User.findOne({ name: participant.value });
            return user?._id;
        })
    );

    const newMeeting = await Meeting.create({
        title,
        description,
        date: new Date(date),
        meetingLink,
        participants: participantsId,
        project,
        createdBy: token.id,
    });

    if (!newMeeting) {
        return NextResponse.json({ error: 'Failed To Create Meeting' });
    }
    return NextResponse.json({ status: true, newMeeting }, { status: 201 });
}
