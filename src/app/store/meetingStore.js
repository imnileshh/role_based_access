import { create } from 'zustand';

const useMeetingStore = create(set => ({
    isMeetingFormOpen: false,
    editingMeeting: null,

    openMeetingForm: () => set({ isMeetingFormOpen: true }),
    closeMeetingForm: () => set({ isMeetingFormOpen: false, editingMeeting: null }),

    setEditingMeeting: meeting => set({ editingMeeting: meeting, isMeetingFormOpen: true }),

    resetEditing: () => set({ editingMeeting: null }),
}));

export default useMeetingStore;
