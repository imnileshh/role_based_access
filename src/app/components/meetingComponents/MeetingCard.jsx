'use client';

export default function MeetingCard({ meeting }) {
    return (
        <div className="border p-4 rounded-md bg-white shadow-md hover:shadow-lg transition w-full max-w-[350px]">
            <h3 className="text-lg font-semibold text-gray-800">{meeting.title}</h3>

            {meeting.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{meeting.description}</p>
            )}

            <div className="mt-2 text-sm space-y-1">
                <p>
                    <span className="font-medium">Date:</span> {meeting.date}
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
                    <span className="font-medium">Project:</span> {meeting.project?.name || 'N/A'}
                </p>
                {meeting.meetingLink && (
                    <p className="truncate">
                        <span className="font-medium">Link:</span>{' '}
                        <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            {meeting.meetingLink}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}
