'use client';
import { useEffect, useState } from 'react';
import LeaveStatsCard from './components/LeaveStatsCard';
import LeaveTabs from './components/LeaveTabs';

export default function LeaveDashboard() {
    const [leaveData, setLeaveData] = useState([]);
    const [leaveStats, setLeaveStats] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function fetchLeaves() {
            const res = await fetch('/api/leave');
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                setLeaveData(data.leaves);

                // Calculate stats
                const stats = {
                    paid: { used: 0, total: 20 },
                    sick: { used: 0, total: 14 },
                };
                data.leaves.forEach(leave => {
                    if (leave.status === 'approved') {
                        stats[leave.leaveType].used += leave.numberOfDays;
                    }
                });
                setLeaveStats(stats);
            }
        }
        fetchLeaves();
    }, []);

    return (
        <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Leave Dashboard</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Apply for Leave
                </button>
            </div>

            {leaveStats && <LeaveStatsCard stats={leaveStats} />}
            <LeaveTabs leaves={leaveData} />

            {/* {modalOpen && <ApplyLeaveModal onClose={() => setModalOpen(false)} />} */}
        </div>
    );
}
