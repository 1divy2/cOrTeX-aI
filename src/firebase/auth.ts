import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

import { useProductivityStore } from "@/store/productivity-store";

import {
  auth,
  googleProvider,
} from "./config";

import {
  useAuthStore,
} from "@/store/auth-store";
import {
  useFocusStore,
} from "@/store/focus-store";

let unsubscribeAuth:
  | (() => void)
  | null = null;

export function initAuth() {
  const {
  setUser,
  setLoading,
  setInitialized,
} =
  useAuthStore.getState();

  setLoading(true);

  if (
    unsubscribeAuth
  ) {
    unsubscribeAuth();
  }

  unsubscribeAuth =
    onAuthStateChanged(
      auth,
      async (
  user: User | null
) => {
        console.log(
          "AUTH STATE:",
          user
            ? user.email
            : "SIGNED OUT"
        );

        setUser(user);

if (user) {
  await useFocusStore
    .getState()
    .initializeSessions(
      user.uid
    );
  await useProductivityStore
  .getState()
  .initializeMetrics(
    user.uid
  );  
}

setInitialized(true);

setLoading(false);
      }
    );
}

export async function loginWithGoogle() {
  try {
    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );

    console.log(
      "GOOGLE LOGIN SUCCESS:",
      result.user.email
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  try {
    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    console.log(
      "EMAIL LOGIN SUCCESS:",
      result.user.email
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "EMAIL LOGIN ERROR:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

export async function signupWithEmail(
  name: string,
  email: string,
  password: string
) {
  try {
    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await updateProfile(
      result.user,
      {
        displayName:
          name,
      }
    );

    console.log(
      "SIGNUP SUCCESS:",
      result.user.email
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "SIGNUP ERROR:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

export async function logout() {
  try {
    await signOut(auth);

    console.log(
      "USER LOGGED OUT"
    );

    useAuthStore
      .getState()
      .setUser(null);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}