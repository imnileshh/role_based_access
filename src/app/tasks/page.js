'use client';
import { useState } from 'react';
import ProjectDashboardPage from '../components/projectComponents/ProjectDashboard';

export default function DashboardPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 to-white text-gray-800 p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-700">
                📋 Task Dashboard
            </h1>
            <ProjectDashboardPage />
        </div>
    );
}
