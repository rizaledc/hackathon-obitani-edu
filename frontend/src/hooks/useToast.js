import { create } from 'zustand';

const useToast = create((set) => ({
  toast: { message: '', type: 'success', visible: false },
  showToast: (message, type = 'success') => set({ toast: { message, type, visible: true } }),
  hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } }))
}));

export default useToast;
