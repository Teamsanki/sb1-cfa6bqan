import { create } from 'zustand';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));