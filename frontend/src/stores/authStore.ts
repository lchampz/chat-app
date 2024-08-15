import { IUser } from "@/types/IUser";
import { create } from "zustand";

export type AuthState = {
  user: IUser | null;
};

export type AuthActions = {
  setUser: (user: IUser) => void;
  clearUser: () => void;
};

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
