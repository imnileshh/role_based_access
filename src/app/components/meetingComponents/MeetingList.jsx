'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import MeetingCard from './MeetingCard';

export default function MeetingList({ projectId }) {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const userName = session?.user?.name;

    useEffect(() => {
        if (!userName) return;

        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/meetings?projectId=${projectId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(res.error);

                const fetchedMeetings = data.meetings || [];
                setMeetings(fetchedMeetings);

                console.log('All meetings', fetchedMeetings);
            } catch (err) {
                console.error('Failed to fetch Meetings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [userName, projectId]);

    return (
        <div className="flex flex-col lg:flex-row lg:gap-6  ">
            <div className="w-full  bg-white p-4 rounded shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">📝 Meetings</h2>

                {loading ? (
                    <p className="text-blue-600 font-semibold">Loading Meetings...</p>
                ) : meetings.length === 0 ? (
                    <p className="text-red-500 font-semibold">No Meetings assigned to you.</p>
                ) : (
                    <div>
                        {meetings.map(meeting => (
                            <MeetingCard key={meeting._id} meeting={meeting} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
