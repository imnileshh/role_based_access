'use client';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useTaskStore from '../../store/taskStore';

export default function TaskCard({ tasks }) {
    const { data: session } = useSession();
    const { setEditingTask } = useTaskStore();
    const [tasksByStatus, setTasksByStatus] = useState({
        pending: [],
        'in progress': [],
        completed: [],
    });
    // const [status, setStatus] = useState(task.status || 'pending');
    useEffect(() => {
        const grouped = {
            pending: [],
            'in progress': [],
            completed: [],
        };

        tasks.forEach(task => {
            grouped[task.status || 'pending'].push(task);
        });
        setTasksByStatus(grouped);
    }, [tasks]);

    const handleDragDrop = async result => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        const sourceList = Array.from(tasksByStatus[source.droppableId]);
        const task = sourceList[source.index];

        if (source.droppableId === destination.droppableId) {
            sourceList.splice(source.index, 1);
            sourceList.splice(destination.index, 0, task);

            setTasksByStatus(prev => ({
                ...prev,
                [source.droppableId]: sourceList,
            }));
            return;
        }

        const destList = Array.from(tasksByStatus[destination.droppableId]);
        const updatedTask = { ...task, status: destination.droppableId };

        sourceList.splice(source.index, 1);
        destList.splice(destination.index, 0, updatedTask);

        setTasksByStatus(prev => ({
            ...prev,
            [source.droppableId]: sourceList,
            [destination.droppableId]: destList,
        }));

        // Update in DB
        try {
            await fetch(`/api/tasks/${draggableId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: destination.droppableId }),
            });
        } catch (err) {
            console.error('Failed to update task status:', err);
        }
    };

    const handleDeleteTask = async id => {
        if (!confirm('Are You sure you want to delete this task?')) return;
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });
            const deleteRes = await res.json();
            if (res.ok) {
                alert(`Task with ${id} deleted`);
            }
            console.log('deleteRes', deleteRes);
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task');
        }
    };

    // const updateStatus = async newStatus => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch(`/api/tasks/${task._id}`, {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ status: newStatus }),
    //         });
    //         if (res.ok) {
    //             setStatus(newStatus);
    //         } else {
    //             const data = await res.json();
    //             alert(data.error || 'Failed to update task');
    //         }
    //     } catch (err) {
    //         alert(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <DragDropContext onDragEnd={handleDragDrop}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 p-2 sm:p-4">
                {['pending', 'in progress', 'completed'].map(status => (
                    <Droppable droppableId={status} key={status}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`p-3 sm:p-4 rounded-lg min-h-[250px] sm:min-h-[350px] transition shadow-md border ${
                                    snapshot.isDraggingOver
                                        ? 'border-purple-400 bg-purple-900/30'
                                        : 'border-gray-700 bg-[#1a1a1f] hover:bg-[#222229]'
                                }`}
                            >
                                <h3
                                    className={`text-lg sm:text-xl font-bold capitalize mb-4 ${
                                        status === 'pending'
                                            ? 'text-yellow-400'
                                            : status === 'in progress'
                                            ? 'text-blue-400'
                                            : 'text-green-400'
                                    }`}
                                >
                                    {status}
                                </h3>

                                {tasksByStatus[status]?.length ? (
                                    tasksByStatus[status].map((task, index) => (
                                        <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`relative p-3 sm:p-4 rounded-lg shadow-md border-l-4 mb-3 bg-[#0e0e12] text-white transition-all duration-300 ${
                                                        status === 'pending'
                                                            ? 'border-yellow-500'
                                                            : status === 'in progress'
                                                            ? 'border-blue-500'
                                                            : 'border-green-500'
                                                    } ${
                                                        snapshot.isDragging
                                                            ? 'scale-105 bg-purple-900/40'
                                                            : 'hover:shadow-lg hover:scale-[1.02]'
                                                    }`}
                                                >
                                                    {/* Status Badge */}
                                                    <div
                                                        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full border ${
                                                            status === 'pending'
                                                                ? 'border-yellow-500 text-yellow-400'
                                                                : status === 'in progress'
                                                                ? 'border-blue-500 text-blue-400'
                                                                : 'border-green-500 text-green-400'
                                                        } bg-[#1e1e24]`}
                                                    >
                                                        {status}
                                                    </div>

                                                    <h4 className="text-base sm:text-lg font-semibold">
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>

                                                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                                                        <p>
                                                            📅{' '}
                                                            <span className="font-medium">
                                                                Due:
                                                            </span>{' '}
                                                            {new Date(
                                                                task.dueDate
                                                            ).toLocaleDateString()}
                                                        </p>
                                                        <p>
                                                            👤{' '}
                                                            <span className="font-medium">
                                                                Assigned:
                                                            </span>{' '}
                                                            {task.assignedTo?.name || '—'}
                                                        </p>
                                                        <p>
                                                            🛠️{' '}
                                                            <span className="font-medium">
                                                                Created:
                                                            </span>{' '}
                                                            {task.createdBy?.name || '—'}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 flex-wrap mt-3">
                                                        {session?.user.name ===
                                                            task.createdBy?.name && (
                                                            <button
                                                                className="p-2 rounded bg-red-600 hover:bg-red-500 transition"
                                                                onClick={() =>
                                                                    handleDeleteTask(task._id)
                                                                }
                                                            >
                                                                🗑
                                                            </button>
                                                        )}
                                                        {session?.user.name ===
                                                            task.createdBy?.name && (
                                                            <button
                                                                className="p-2 rounded bg-green-600 hover:bg-green-500 transition"
                                                                onClick={() => setEditingTask(task)}
                                                            >
                                                                ✏️
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No tasks here</p>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}
