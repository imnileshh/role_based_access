'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
export default function MeetingForm({ projectId, onClose }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        meetingLink: '',
        participants: [],
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all users for the participant dropdown
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                if (res.ok) setUsers(data.users);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const userOptions = users.map(user => ({
        label: user.name,
        value: user.name,
    }));

    const handleParticipantsChange = selectedOptions => {
        setForm(prev => ({
            ...prev,
            participants: selectedOptions.map(opt => opt.value),
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, project: projectId }),
            });
            const data = await res.json();
            if (res.ok) {
                alert('Meeting scheduled successfully!');
                onClose(); // close modal or form
            } else {
                alert(data.error || 'Failed to schedule meeting');
            }
        } catch (err) {
            alert('Something went wrong: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md p-6 rounded shadow-lg space-y-4"
            >
                <h2 className="text-xl font-bold text-gray-800">📅 Schedule Meeting</h2>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Meeting Title"
                    required
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Meeting Description"
                    className="w-full border p-2 rounded"
                />

                <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    name="meetingLink"
                    value={form.meetingLink}
                    onChange={handleChange}
                    placeholder="Meeting Link (Zoom/Meet)"
                    className="w-full border p-2 rounded"
                />

                <Select
                    isMulti
                    options={userOptions}
                    name="participants"
                    placeholder="Select participants"
                    onChange={handleParticipantsChange}
                    isSearchable
                    className="react-select-container border rounded"
                    classNamePrefix="react-select"
                />
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-red-400 text-white hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading ? 'Scheduling...' : 'Schedule'}
                    </button>
                </div>
            </form>
        </div>
    );
}
