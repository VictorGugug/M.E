import { create } from "zustand";

const KEY = "zarxp-user";

interface UserStore {
  userName: string;
  userPicture: string;
  setUserName: (name: string) => void;
  setUserPicture: (pic: string) => void;
}

function load(): { userName: string; userPicture: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.userName && p.userPicture) return p;
    }
  } catch {}
  return { userName: "Zelly", userPicture: "snowflake.png" };
}

const saved = load();

export const useUserStore = create<UserStore>((set) => ({
  userName: saved.userName,
  userPicture: saved.userPicture,
  setUserName: (name) => {
    set({ userName: name });
    try { localStorage.setItem(KEY, JSON.stringify({ userName: name, userPicture: useUserStore.getState().userPicture })); } catch {}
  },
  setUserPicture: (pic) => {
    set({ userPicture: pic });
    try { localStorage.setItem(KEY, JSON.stringify({ userName: useUserStore.getState().userName, userPicture: pic })); } catch {}
  },
}));
