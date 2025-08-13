'use client';
import { useEffect, useState } from 'react';
import LeaveCard from './LeaveCard';

export default function LeaveTabs({ leaves }) {
    const [tab, setTab] = useState('pending');
    const filteredLeaves = leaves.filter(l => l.status === tab);

    const [name, setName] = useState('');

    useEffect(() => {
        const fetchLeaves = async () => {
            const res = await fetch(`/api/leave?status=${tab}&name=${name}`);
        };
    }, [tab]);

    return (
        <div>
            <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
                {['pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setTab(status)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap
                    ${
                        tab === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredLeaves.length > 0 ? (
                    filteredLeaves.map(leave => <LeaveCard key={leave._id} leave={leave} />)
                ) : (
                    <p className="text-gray-500">No {tab} leaves found.</p>
                )}
            </div>
        </div>
    );
}
