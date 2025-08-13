'use client';
import { useEffect, useState } from 'react';
import ApplyLeaveModal from './components/ApplyLeaveModal';
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
        <div className="p-6 bg-black min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-white">Leave Dashboard</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Apply for Leave
                </button>
            </div>

            {leaveStats && <LeaveStatsCard stats={leaveStats} />}
            <LeaveTabs leaves={leaveData} />

            {modalOpen && <ApplyLeaveModal onClose={() => setModalOpen(false)} />}
        </div>
    );
}
