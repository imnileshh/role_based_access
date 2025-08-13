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
    const [projectDetails, setProjectDetails] = useState(null);
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
                setSelectedProjectId(data.projects[0]?._id);
                setProjectDetails(data.projects[0]);
            }
        }
        fetchProjects();
    }, []);

    const handleProjectDropDown = e => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);
    };
    useEffect(() => {
        const data = projects.find(project => project._id === selectedProjectId);
        console.log('data', data);
        setProjectDetails(data);
    }, [selectedProjectId]);

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
        <div className="flex flex-col bg-[#0e0e12] text-white gap-6 min-h-screen  sm:p-2">
            {/* Project Dropdown + Add Button */}
            <div className="bg-[#1a1a20] shadow-md rounded-lg p-4">
                <div className="flex  sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="text-xl font-bold text-white">📂 Projects</h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    >
                        {showAddForm ? 'Close' : 'Add Project'}
                    </button>
                </div>

                {showAddForm && (
                    <form
                        onSubmit={handleAddProject}
                        className="space-y-3 mb-6 bg-[#0e0e12] p-4 rounded-lg border border-gray-700"
                    >
                        <input
                            name="name"
                            placeholder="Project Name"
                            value={projectForm.name}
                            onChange={handleProjectFormChange}
                            className="w-full px-3 py-2 bg-[#1f1f24] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={projectForm.description}
                            onChange={handleProjectFormChange}
                            className="w-full px-3 py-2 bg-[#1f1f24] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                            Create
                        </button>
                    </form>
                )}

                {/* Project Dropdown */}
                <div className="mt-2">
                    <label
                        className="block mb-2 text-sm font-medium text-gray-300"
                        htmlFor="projectDropDown"
                    >
                        Select Project
                    </label>
                    <select
                        className="w-full sm:w-1/2 p-2 bg-[#1f1f24] border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
                        name="projectDropDown"
                        id="projectDropDown"
                        value={selectedProjectId || ''}
                        onChange={handleProjectDropDown}
                    >
                        {projects?.map(project => (
                            <option className="text-white" key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-[#1a1a20] rounded-lg shadow-md p-4 flex flex-col gap-4">
                <div className="flex justify-between mb-3">
                    <h2 className="text-2xl font-bold ">{projectDetails?.name || 'Loading'}</h2>
                    <div>
                        {activeTab === 'tasks' ? (
                            <button
                                onClick={() => openTaskForm()}
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-all"
                            >
                                + Add Task
                            </button>
                        ) : (
                            <button
                                onClick={() => openMeetingForm()}
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-all"
                            >
                                + Schedule Meeting
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex gap-6 border-b border-gray-700 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`pb-2 px-1 sm:px-4 transition-all duration-200 ${
                            activeTab === 'tasks'
                                ? 'border-b-2 border-blue-500 text-blue-400 font-semibold'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('meetings')}
                        className={`pb-2 px-1 sm:px-4 transition-all duration-200 ${
                            activeTab === 'meetings'
                                ? 'border-b-2 border-blue-500 text-blue-400 font-semibold'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Meetings
                    </button>
                </div>

                {/* Action Buttons */}

                {/* Forms */}
                {isTaskFormOpen && (
                    <CreateTaskForm projectId={selectedProjectId} onClose={() => closeTaskForm()} />
                )}
                {isMeetingFormOpen && (
                    <MeetingForm projectId={selectedProjectId} onClose={() => closeMeetingForm()} />
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
