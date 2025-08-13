'use client';
import { useEffect, useState } from 'react';
import useTaskStore from '../../store/taskStore';

export default function CreateTaskForm({ projectId }) {
    const { openTaskForm, setEditingTask, closeTaskForm, isTaskFormOpen, editingTaskData } =
        useTaskStore();
    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: '',
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await fetch('/api/users');
                const userData = await userRes.json();
                if (userRes.ok) setUsers(userData.users);
            } catch (err) {
                setError('Failed to load users');
            }
        }
        if (isTaskFormOpen) fetchData();
    }, [isTaskFormOpen]);

    useEffect(() => {
        if (editingTaskData) {
            let newDate = new Date(editingTaskData.dueDate).toISOString().split('T')[0];

            setForm({
                title: editingTaskData.title,
                description: editingTaskData.description,
                dueDate: newDate,
                assignedTo: editingTaskData.assignedTo.name,
            });
        }
    }, [editingTaskData]);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!form.title || !form.assignedTo) {
                throw new Error('Title and Assigned To are required');
            }

            const method = editingTaskData ? 'PATCH' : 'POST';
            const url = editingTaskData ? `/api/tasks/${editingTaskData._id}` : `/api/tasks`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, status: 'pending', project: projectId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create task');

            alert('✅ Task Created');
            setForm({ title: '', description: '', dueDate: '', assignedTo: '' });
            closeTaskForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isTaskFormOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative text-black">
                <h2 className="text-lg font-semibold mb-4">Create Task</h2>
                {error && <p className="text-red-600">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            className="w-full border px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full border px-2 py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            className="w-full border px-2 py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="assignedTo">Assign To</label>
                        <select
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            className="w-full border px-2 py-1"
                            required
                        >
                            <option value="">-- Select Employee --</option>
                            {users.map(user => (
                                <option key={user._id} value={user.name}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => closeTaskForm()}
                            className="px-4 py-2 rounded bg-red-400 text-white hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {editingTaskData
                                ? loading
                                    ? 'editing Task'
                                    : 'Edit Task'
                                : loading
                                ? 'Creating Task'
                                : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
