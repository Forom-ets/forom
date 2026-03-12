import { create } from 'zustand';
// Import local types safely if needed, otherwise use ANY right now. We'll type this properly.
// e.g., import type { Quest } from '../components/QuestModal';

/**
 * @interface ModalStore
 * Global orchestration for modal overlays and side panels.
 * Prevents prop-drilling open/close bools deeply into CarouselGrid.
 */
interface ModalStore {
  // Modal visibility flags
  isWalletOpen: boolean;
  isQuestOpen: boolean;
  isUserOpen: boolean;
  isRomapOpen: boolean;
  isSettingsOpen: boolean;
  isMemoryOpen: boolean;
  isVideoOpen: boolean;

  // Selected Payloads (Data displayed inside the active modal)
  selectedQuest: any | null;    // Replace 'any' with explicit Quest type later
  selectedUserId: string | null;
  selectedMemory: any | null;   // Replace 'any' with Memory object type
  selectedVideo: any | null;    // Replace 'any' with Video object type

  // Open Actions
  openWallet: () => void;
  openQuest: (quest?: any) => void;
  openUser: (userId?: string) => void;
  openRomap: () => void;
  openSettings: () => void;
  openMemory: (memory?: any) => void;
  openVideo: (video?: any) => void;

  // Close Actions
  closeWallet: () => void;
  closeQuest: () => void;
  closeUser: () => void;
  closeRomap: () => void;
  closeSettings: () => void;
  closeMemory: () => void;
  closeVideo: () => void;

  /** Instant reset button for UI emergency or phase shifts */
  closeAll: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // Defaults
  isWalletOpen: false,
  isQuestOpen: false,
  isUserOpen: false,
  isRomapOpen: false,
  isSettingsOpen: false,
  isMemoryOpen: false,
  isVideoOpen: false,

  selectedQuest: null,
  selectedUserId: null,
  selectedMemory: null,
  selectedVideo: null,

  // Setters
  openWallet: () => set({ isWalletOpen: true }),
  closeWallet: () => set({ isWalletOpen: false }),

  openQuest: (quest) => set({ isQuestOpen: true, selectedQuest: quest ?? null }),
  closeQuest: () => set({ isQuestOpen: false, selectedQuest: null }),

  openUser: (userId) => set({ isUserOpen: true, selectedUserId: userId ?? null }),
  closeUser: () => set({ isUserOpen: false, selectedUserId: null }),

  openRomap: () => set({ isRomapOpen: true }),
  closeRomap: () => set({ isRomapOpen: false }),

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),

  openMemory: (memory) => set({ isMemoryOpen: true, selectedMemory: memory ?? null }),
  closeMemory: () => set({ isMemoryOpen: false, selectedMemory: null }),

  openVideo: (video) => set({ isVideoOpen: true, selectedVideo: video ?? null }),
  closeVideo: () => set({ isVideoOpen: false, selectedVideo: null }),

  closeAll: () => set({
    isWalletOpen: false,
    isQuestOpen: false,
    isUserOpen: false,
    isRomapOpen: false,
    isSettingsOpen: false,
    isMemoryOpen: false,
    isVideoOpen: false,
    selectedQuest: null,
    selectedUserId: null,
    selectedMemory: null,
    selectedVideo: null,
  }),
}));
