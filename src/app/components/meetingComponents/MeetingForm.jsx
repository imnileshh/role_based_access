'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import useMeetingStore from '../../store/meetingStore';
export default function MeetingForm({ projectId, onClose }) {
    const { isMeetingFormOpen, closeMeetingForm, editingMeeting } = useMeetingStore();

    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        meetingLink: '',
        participants: [],
    });

    useEffect(() => {
        if (editingMeeting) {
            const dt = new Date(editingMeeting.date);

            const localDatetime = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16); // format: 'YYYY-MM-DDTHH:mm'
            console.log(localDatetime);
            setForm({
                title: editingMeeting.title,
                description: editingMeeting.description,
                date: localDatetime, // format for input[type=datetime-local]
                meetingLink: editingMeeting.meetingLink,
                participants:
                    editingMeeting.participants?.map(p => ({
                        label: p.name,
                        value: p.name,
                    })) || [],
            });
        }
    }, [editingMeeting]);

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
            participants: selectedOptions.map(opt => ({
                label: opt.label,
                value: opt.value,
            })),
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const method = editingMeeting ? 'PATCH' : 'POST';
        const url = editingMeeting ? `/api/meetings/${editingMeeting._id}` : `/api/meetings`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, project: projectId }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(editingMeeting ? 'Meeting updated!' : 'Meeting scheduled!');
                closeMeetingForm();
            } else {
                alert(data.error || 'Failed to save meeting');
            }
        } catch (err) {
            alert('Error: ' + err.message);
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
                <h2 className="text-xl font-bold text-gray-800">
                    📅 {editingMeeting ? 'Editing Meeting' : 'Schedule Meeting'}
                </h2>

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
                    value={form.participants}
                />
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => closeMeetingForm()}
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
