'use client';
import { useEffect, useState } from 'react';
import useMeetingStore from '../../store/meetingStore';
import useTaskStore from '../../store/taskStore';
import MeetingForm from '../meetingComponents/MeetingForm';
import MeetingList from '../meetingComponents/MeetingList';
import CreateTaskForm from '../taskComponents/CreateTaskForm';
import TaskList from '../taskComponents/TaskList';
export default function ProjectDashboardPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [projectForm, setProjectForm] = useState({ name: '', description: '' });
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'meetings'

    const { isMeetingFormOpen, closeMeetingForm, openMeetingForm } = useMeetingStore();
    const { isTaskFormOpen, openTaskForm, closeTaskForm } = useTaskStore();

    useEffect(() => {
        async function fetchProjects() {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (res.ok) {
                setProjects(data.projects);
                setSelectedProjectId(data.projects[0]._id);
            }
        }
        fetchProjects();
    }, []);

    const handleProjectClick = id => setSelectedProjectId(id);
    const handleProjectFormChange = e => {
        setProjectForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddProject = async e => {
        e.preventDefault();
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectForm),
        });
        const data = await res.json();
        if (res.ok) {
            setProjects(prev => [...prev, data.project]);
            setProjectForm({ name: '', description: '' });
            setShowAddForm(false);
        } else {
            alert(data.error || 'Failed to add project');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[25%] bg-white shadow-lg rounded-lg p-4   sm:h-screen  ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">📂 Projects</h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    >
                        {showAddForm ? 'Close' : 'Add'}
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddProject} className="space-y-3 mb-6">
                        <input
                            name="name"
                            placeholder="Name"
                            value={projectForm.name}
                            onChange={handleProjectFormChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={projectForm.description}
                            onChange={handleProjectFormChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                        <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Create
                        </button>
                    </form>
                )}

                <ul className="space-y-2">
                    {projects.map(project => (
                        <li
                            key={project._id}
                            onClick={() => handleProjectClick(project._id)}
                            className={`group cursor-pointer p-2 rounded flex justify-between items-center transition duration-200 ${
                                selectedProjectId === project._id
                                    ? 'bg-blue-100 font-bold'
                                    : 'hover:bg-blue-50'
                            }`}
                        >
                            <span>{project.name}</span>
                            <button
                                onClick={() => openTaskForm()}
                                className="bg-gray-400 group-hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                                +
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isTaskFormOpen && (
                <CreateTaskForm
                    projectId={selectedProjectId}
                    isOpen={isTaskFormOpen}
                    // onClick={() => closeTaskForm()}
                />
            )}

            <div className="w-100 sm:w-[75%] p-4 space-y-4">
                {/* Tabs */}
                <div className="flex gap-4 border-b">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`py-2 px-4 ${
                            activeTab === 'tasks' ? 'border-b-2 border-blue-500 font-semibold' : ''
                        }`}
                    >
                        Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('meetings')}
                        className={`py-2 px-4 ${
                            activeTab === 'meetings'
                                ? 'border-b-2 border-blue-500 font-semibold'
                                : ''
                        }`}
                    >
                        Meetings
                    </button>
                </div>

                {/* Action Buttons */}
                <div>
                    {activeTab === 'tasks' ? (
                        <button
                            onClick={() => openTaskForm()}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            + Add Task
                        </button>
                    ) : (
                        <button
                            onClick={() => openMeetingForm()}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            + Schedule Meeting
                        </button>
                    )}
                </div>

                {/* Forms */}
                {isTaskFormOpen && (
                    <CreateTaskForm projectId={selectedProjectId} onClose={() => closeTaskForm()} />
                )}
                {isMeetingFormOpen && (
                    <MeetingForm
                        projectId={selectedProjectId}
                        onClose={() =>
                            // setOpenMeetingForm(false)
                            closeMeetingForm()
                        }
                    />
                )}

                {/* Tab Panels */}
                <div>
                    {activeTab === 'tasks' && <TaskList projectId={selectedProjectId} />}
                    {activeTab === 'meetings' && <MeetingList projectId={selectedProjectId} />}
                </div>
            </div>
        </div>
    );
}
