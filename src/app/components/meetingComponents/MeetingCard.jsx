'use client';

import Link from 'next/link';
import useMeetingStore from '../../store/meetingStore';

export default function MeetingCard({ meeting }) {
    const { setEditingMeeting } = useMeetingStore();

    const handleDelete = async id => {
        try {
            const res = await fetch(`/api/meetings/${id}`, {
                method: 'DELETE',
            });
            const deleteRes = await res.json();
            if (res.ok) {
                alert(`meeting with ${id} deleted`);
            }
            console.log('deleteRes', deleteRes);
        } catch (error) {
            console.error('Failed to delete Meeting:', error);
            alert('Failed to delete Meeting');
        }
    };

    return (
        <div className="border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition w-full max-w-[350px]">
            <h3 className="text-lg font-semibold text-gray-800">{meeting.title}</h3>

            {meeting.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{meeting.description}</p>
            )}

            <div className="mt-2 text-sm space-y-1">
                <p>
                    <span className="font-medium">Date: </span>
                    {new Date(meeting.date).toLocaleDateString()}
                </p>
                <p>
                    <span className="font-medium">Time: </span>{' '}
                    {new Date(meeting.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <p>
                    <span className="font-medium">Participants:</span>{' '}
                    {meeting.participants?.map(p => p.name).join(', ')}
                </p>
                <p>
                    <span className="font-medium">Created By:</span>{' '}
                    {meeting.createdBy?.name || 'N/A'}
                </p>
                <p>
                    <span className="font-medium">Project:</span> {meeting.project[0]?.name}
                </p>
                {meeting.meetingLink && (
                    <p className="truncate">
                        <span className="font-medium">Link:</span>{' '}
                        <Link
                            href={
                                meeting.meetingLink.startsWith('http')
                                    ? meeting.meetingLink
                                    : `https://${meeting.meetingLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            {meeting.meetingLink}
                        </Link>
                    </p>
                )}
                <div className="flex flex-row  flex-wrap gap-6">
                    <button
                        className="mt-3 bg-gray-200 text-white px-3 py-1 rounded "
                        onClick={() => handleDelete(meeting._id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="red"
                        >
                            <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                        </svg>
                    </button>
                    <button
                        className="mt-3 bg-gray-200 text-white px-3 py-1 rounded "
                        onClick={() => setEditingMeeting(meeting)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="green"
                        >
                            <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
