'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ projectId }) {
    const [tasks, SetTasks] = useState([]);
    const [createdTasks, setCreatedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const userName = session?.user?.name;

    useEffect(() => {
        if (!userName) return;

        const fetchTasks = async () => {
            setLoading(true);
            try {
                // const [assignedRes, createdRes] = await Promise.all([
                //     fetch('/api/tasks'),
                //     fetch(`/api/tasks?projectId=${'68779fbcf46821b6d249928d'}`),
                // ]);

                // const [assignedData, createdData] = await Promise.all([
                //     assignedRes.json(),
                //     createdRes.json(),
                // ]);
                //  if (assignedRes.ok) setAssignedTasks(assignedData.tasks || []);
                //  if (createdRes.ok) setCreatedTasks(createdData.tasks || []);
                const res = await fetch(`/api/tasks?projectId=${projectId}`);
                const data = await res.json();
                if (!res.ok) throw new Error('Failed to fetch tasks');

                const tasks = data.tasks || [];

                // Separate assigned and created tasks here
                const assigned = tasks.filter(task => task.assignedTo?.name === userName);
                const created = tasks.filter(task => task.createdBy?.name === userName);

                SetTasks(tasks);
                setCreatedTasks(created);

                console.log('All Tasks', tasks);
                // console.log('createdData', created);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [userName, projectId]);

    return (
        <div className="flex flex-col lg:flex-row lg:gap-6 w-full">
            <div className="w-full bg-[#0e0e12] p-4 rounded shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-4 text-center">
                    📝 Tasks
                </h2>

                {loading ? (
                    <p className="text-blue-400 font-semibold text-center">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-red-400 font-semibold text-center">
                        No tasks assigned to you.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <TaskCard tasks={tasks} />
                    </div>
                )}
            </div>

            {/* <div className="w-full lg:w-1/2 bg-white p-4 mt-6 lg:mt-0 rounded shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 Tasks I Created</h2>

                {loading ? (
                    <p className="text-blue-600 font-semibold">Loading tasks...</p>
                ) : createdTasks.length === 0 ? (
                    <p className="text-red-500 font-semibold">No tasks created by you.</p>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {createdTasks.map(task => (
                            <TaskCard key={task._id} task={task} />
                        ))}
                    </div>
                )}
            </div> */}
        </div>
    );
}
