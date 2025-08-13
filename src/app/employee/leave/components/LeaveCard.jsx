export default function LeaveCard({ leave }) {
    return (
        <div className="bg-gray-900 shadow p-4 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white">{leave.leaveType} Leave</h3>
            <p className="text-sm text-gray-300">
                From: {new Date(leave.startDate).toLocaleDateString()} — To:{' '}
                {new Date(leave.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1 text-gray-300">Reason: {leave.reason}</p>
            <p className="text-sm text-gray-500 mt-1">
                Status: <span className="capitalize">{leave.status}</span>
            </p>
        </div>
    );
}
