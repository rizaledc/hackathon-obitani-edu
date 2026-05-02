import { create } from 'zustand';

const useConfirm = create((set, get) => ({
  confirmState: { message: '', visible: false, resolve: null },
  showConfirm: (message) => {
    return new Promise((resolve) => {
      set({ confirmState: { message, visible: true, resolve } });
    });
  },
  handleConfirm: () => {
    const { resolve } = get().confirmState;
    if (resolve) resolve(true);
    set({ confirmState: { message: '', visible: false, resolve: null } });
  },
  handleCancel: () => {
    const { resolve } = get().confirmState;
    if (resolve) resolve(false);
    set({ confirmState: { message: '', visible: false, resolve: null } });
  }
}));

export default useConfirm;
