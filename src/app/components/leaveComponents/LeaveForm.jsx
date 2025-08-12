'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const LeaveForm = () => {
    const [form, setForm] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        application: '',
    });

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const generateAIMessage = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/generateMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leaveType: form.leaveType,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    reason: form.reason,
                }),
            });

            const data = await res.json();
            if (res.ok && data?.message) {
                setForm(prev => ({ ...prev, application: data.message }));
            } else {
                alert(data.error || 'Failed to generate message');
            }
        } catch (err) {
            alert('AI Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const res = await fetch('/api/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
            alert('Leave Applied Successfully!');
            setForm({
                leaveType: 'paid',
                startDate: '',
                endDate: '',
                reason: '',
                application: '',
            });
        } else {
            alert(data.error || 'Failed to apply for leave');
        }
    };

    const MarkdownPreview = dynamic(() => import('react-markdown'), { ssr: false });

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
            <h2 className="text-xl font-semibold">Leave Application Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Leave Type</label>
                    <select
                        name="leaveType"
                        value={form.leaveType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Leave Type</option>
                        <option value="paid">Paid Leave</option>
                        <option value="sick">Sick Leave</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-medium">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Reason</label>
                    <input
                        type="text"
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-medium">Leave Application</span>
                    <button
                        type="button"
                        onClick={generateAIMessage}
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                        {loading ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>

                <textarea
                    name="application"
                    rows={8}
                    value={form.application}
                    onChange={handleChange}
                    placeholder="AI-generated leave message will appear here. You can edit before submitting."
                    className="w-full p-2 border rounded font-mono"
                />

                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreview(!preview)}
                        className="text-sm text-blue-500 underline"
                    >
                        {preview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </div>
            </form>

            {preview && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-medium mb-2">📄 Preview</h3>
                    <MarkdownPreview>{form.application}</MarkdownPreview>
                </div>
            )}
        </div>
    );
};

export default LeaveForm;
