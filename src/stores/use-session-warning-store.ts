'use client';

import { create } from 'zustand';

type SessionWarningStore = {
  open: boolean;
  secondsRemaining: number | null;
  show: (secondsRemaining: number) => void;
  hide: () => void;
};

export const useSessionWarningStore = create<SessionWarningStore>((set) => ({
  open: false,
  secondsRemaining: null,
  show: (secondsRemaining) => set({ open: true, secondsRemaining }),
  hide: () => set({ open: false, secondsRemaining: null }),
}));
