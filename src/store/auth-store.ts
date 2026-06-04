import {
  create,
} from "zustand";

import { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;

  loading: boolean;

  initialized: boolean;

  setUser: (
    user: User | null
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  setInitialized: (
    initialized: boolean
  ) => void;
};

export const useAuthStore =
  create<AuthState>(
    (set) => ({
      user: null,

      loading: true,

      initialized: false,

      setUser: (
        user
      ) =>
        set({
          user,
        }),

      setLoading: (
        loading
      ) =>
        set({
          loading,
        }),

      setInitialized: (
        initialized
      ) =>
        set({
          initialized,
        }),
    })
  );