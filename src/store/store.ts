import { create } from 'zustand'

export const useUserStore = create((set) => ({
  username: "Psycho", 
  email: "",
  userId: "",
  isLogin: false,
  setIsLogin: (newIsLogin: boolean) => set({ isLogin: newIsLogin }),
  setUsername: (newUsername: string) => set({ username: newUsername }),
  setEmail: (newEmail: string) => set({ email: newEmail }),
  setUserId: (newId: string) => set({ userId: newId }),
}))
