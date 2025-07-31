import User from '../../../../models/user';
import { dbConnect } from '../../components/lib/dbconnect';
import { getUserFromRequest } from '../../components/lib/getUserFromRequest';

export async function GET(req) {
    await dbConnect();
    const token = await getUserFromRequest(req);
    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({}).select('name email');
    //  _id: { $ne: token.id }
    // console.log('users are : ', users);

    return Response.json({ users });
}
