export default function LeaveCard({ leave }) {
    return (
        <div className="bg-white shadow p-4 rounded border">
            <h3 className="text-lg font-semibold">{leave.leaveType} Leave</h3>
            <p className="text-sm text-gray-700">
                From: {new Date(leave.startDate).toLocaleDateString()} — To:{' '}
                {new Date(leave.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1">Reason: {leave.reason}</p>
            <p className="text-sm text-gray-500 mt-1">
                Status: <span className="capitalize">{leave.status}</span>
            </p>
        </div>
    );
}
