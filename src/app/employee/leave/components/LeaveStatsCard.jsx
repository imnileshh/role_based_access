'use client';

export default function LeaveStatsCard({ stats }) {
    // console.log(stats);
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {Object.entries(stats).map(([type, { used, total }]) => (
                <div
                    key={type}
                    className="bg-gray-900 rounded-xl shadow p-4 border border-gray-800"
                >
                    <h3 className="font-semibold text-lg capitalize text-white">{type} Leaves</h3>
                    <p className="text-gray-300 mt-2">Used: {used}</p>
                    <p className="text-gray-300">Remaining: {total - used}</p>
                    <p className="text-sm text-gray-500">Total: {total}</p>
                </div>
            ))}
        </div>
    );
}
