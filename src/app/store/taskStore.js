import { create } from 'zustand';

const useTaskStore = create(set => ({
    isTaskFormOpen: false,
    editingTaskData: null,

    openTaskForm: () => set({ isTaskFormOpen: true }),
    closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskData: null }),

    setEditingTask: task => set({ editingTaskData: task, isTaskFormOpen: true }),

    resetTask: () => set({ editingTaskData: null }),
}));

export default useTaskStore;
