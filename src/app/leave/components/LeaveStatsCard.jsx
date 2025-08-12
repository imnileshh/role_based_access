'use client';

export default function LeaveStatsCard({ stats }) {
    // console.log(stats);
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(stats).map(([type, { used, total }]) => (
                <div key={type} className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold text-lg capitalize">{type} Leaves</h3>
                    <p className="text-gray-700 mt-2">Used: {used}</p>
                    <p className="text-gray-700">Remaining: {total - used}</p>
                    <p className="text-sm text-gray-500">Total: {total}</p>
                </div>
            ))}
        </div>
    );
}
