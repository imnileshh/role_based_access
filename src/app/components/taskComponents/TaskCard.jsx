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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {['pending', 'in progress', 'completed'].map(status => (
                    <Droppable droppableId={status} key={status}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`p-4 rounded-lg min-h-[350px] bg-gray-200 shadow-md transition ${
                                    snapshot.isDraggingOver
                                        ? ' border-2 border-blue-300'
                                        : 'hover:bg-gray-300'
                                }`}
                            >
                                <h3 className="text-xl font-bold capitalize mb-4 text-blue-700">
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
                                                    className={`relative p-4 rounded-lg shadow-md bg-white border-l-4 mb-3  select-text ${
                                                        status === 'pending'
                                                            ? 'border-yellow-500'
                                                            : status === 'in progress'
                                                            ? 'border-blue-500'
                                                            : 'border-green-500'
                                                    } transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                                                        snapshot.isDragging
                                                            ? 'scale-105 bg-blue-50'
                                                            : ''
                                                    }`}
                                                >
                                                    {/* Status Badge */}
                                                    <div
                                                        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border-2 ${
                                                            status === 'pending'
                                                                ? 'border-yellow-500'
                                                                : status === 'in progress'
                                                                ? 'border-blue-500'
                                                                : 'border-green-500'
                                                        } `}
                                                    >
                                                        {status}
                                                    </div>

                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>

                                                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                                                        <p>
                                                            👤{' '}
                                                            <span className="font-medium">
                                                                Due Date:
                                                            </span>{' '}
                                                            {new Date(
                                                                task.dueDate
                                                            ).toLocaleDateString()}
                                                        </p>
                                                        <p>
                                                            👤{' '}
                                                            <span className="font-medium">
                                                                Assigned to:
                                                            </span>{' '}
                                                            {task.assignedTo?.name || '—'}
                                                        </p>
                                                        <p>
                                                            🛠️{' '}
                                                            <span className="font-medium">
                                                                Created by:
                                                            </span>{' '}
                                                            {task.createdBy?.name || '—'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-row sm:flex-row flex-wrap gap-6">
                                                        {session?.user.name ===
                                                            task.createdBy?.name && (
                                                            <button
                                                                className="mt-3 bg-gray-200 text-white px-3 py-1 rounded "
                                                                onClick={() =>
                                                                    handleDeleteTask(task._id)
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    x="0px"
                                                                    y="0px"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="red"
                                                                >
                                                                    <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                                                                </svg>
                                                            </button>
                                                        )}
                                                        {session?.user.name ===
                                                            task.createdBy?.name && (
                                                            <button
                                                                className="mt-3 bg-gray-200 text-white px-3 py-1 rounded "
                                                                onClick={() => setEditingTask(task)}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    x="0px"
                                                                    y="0px"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="green"
                                                                >
                                                                    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">No tasks here</p>
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
