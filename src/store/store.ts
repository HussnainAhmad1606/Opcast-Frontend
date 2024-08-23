import { create } from 'zustand'

export const useUserStore = create((set) => ({
  username: "", 
  email: "",
  userId: "",
  isLogin: false,
  coverImage: "",
  totalEarnings: 0,
  isAdPlaying: true,
  audioURL: "",
  setTotalEarnings: (earning: number) => set({ totalEarnings: earning }),
  setAudioURL: (url: string) => set({ audioURL: url }),
  setCoverImage: (url: string) => set({ coverImage: url }),
  setIsAdPlaying: (newBool: boolean) => set({ isAdPlaying: newBool }),
  setIsLogin: (newIsLogin: boolean) => set({ isLogin: newIsLogin }),
  setUsername: (newUsername: string) => set({ username: newUsername }),
  setEmail: (newEmail: string) => set({ email: newEmail }),
  setUserId: (newId: string) => set({ userId: newId }),
}))
