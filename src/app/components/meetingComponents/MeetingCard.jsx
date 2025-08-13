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
        <div className="border border-gray-700 p-4 rounded-md bg-[#1a1a1f] shadow-md hover:shadow-lg transition w-full max-w-[350px] text-white">
            <h3 className="text-lg font-semibold text-gray-100">{meeting.title}</h3>

            {meeting.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-3">{meeting.description}</p>
            )}

            <div className="mt-2 text-sm space-y-1">
                <p>
                    <span className="font-medium text-purple-400">📅 Date: </span>
                    {new Date(meeting.date).toLocaleDateString()}
                </p>
                <p>
                    <span className="font-medium text-purple-400">⏰ Time: </span>
                    {new Date(meeting.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <p>
                    <span className="font-medium text-purple-400">👥 Participants:</span>{' '}
                    {meeting.participants?.map(p => p.name).join(', ')}
                </p>
                <p>
                    <span className="font-medium text-purple-400">🛠 Created By:</span>{' '}
                    {meeting.createdBy?.name || 'N/A'}
                </p>
                <p>
                    <span className="font-medium text-purple-400">📌 Project:</span>{' '}
                    {meeting.project[0]?.name}
                </p>

                {meeting.meetingLink && (
                    <p className="truncate">
                        <span className="font-medium text-purple-400">🔗 Link:</span>{' '}
                        <Link
                            href={
                                meeting.meetingLink.startsWith('http')
                                    ? meeting.meetingLink
                                    : `https://${meeting.meetingLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-300"
                        >
                            {meeting.meetingLink}
                        </Link>
                    </p>
                )}

                {/* Buttons */}
                <div className="flex flex-row flex-wrap gap-4 mt-3">
                    <button
                        className="p-2 rounded bg-red-600 hover:bg-red-500 transition"
                        onClick={() => handleDelete(meeting._id)}
                    >
                        🗑
                    </button>
                    <button
                        className="p-2 rounded bg-green-600 hover:bg-green-500 transition"
                        onClick={() => setEditingMeeting(meeting)}
                    >
                        ✏️
                    </button>
                </div>
            </div>
        </div>
    );
}
