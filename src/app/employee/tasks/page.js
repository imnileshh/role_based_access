'use client';
import { useState } from 'react';
import ProjectDashboardPage from '../../components/projectComponents/ProjectDashboard';

export default function DashboardPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="min-h-screen bg-[#0e0e12] text-gray-800 ">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">📋</h1>
            <ProjectDashboardPage />
        </div>
    );
}
