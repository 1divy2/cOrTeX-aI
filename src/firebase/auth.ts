import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { useFocusStore } from "@/store/focus-store";
import { useNotesStore } from "@/store/notes-store";
import { useTasksStore } from "@/store/tasks-store";
import { useSettingsStore } from "@/store/settings-store";
import { useProductivityStore } from "@/store/productivity-store";
import { useIntelligenceStore } from "@/store/intelligence-store";

let authListener: any = null;
let isSyncing = false;
let hasSyncedForSession = false;

export function initAuth() {
  const { setUser, setLoading, setInitialized } = useAuthStore.getState();
  setLoading(true);

  if (authListener) {
    authListener.subscription.unsubscribe();
  }

  // Initial session check
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user || null);
    if (session?.user) {
      if (!isSyncing && !hasSyncedForSession) {
        setTimeout(() => handleUserLogin(session.user.id), 0);
      }
    } else {
      setLoading(false);
      setInitialized(true);
    }
  });

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("AUTH STATE:", event, session?.user?.email || "SIGNED OUT");
    setUser(session?.user || null);

    if (session?.user) {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (!isSyncing && !hasSyncedForSession) {
          setTimeout(() => handleUserLogin(session.user.id), 0);
        }
      }
    } else {
      hasSyncedForSession = false;
      setLoading(false);
      setInitialized(true);
    }
  });

  authListener = data;
}

async function handleUserLogin(userId: string) {
  if (isSyncing) return;
  isSyncing = true;
  try {
    console.log("[handleUserLogin] Starting for userId:", userId);
    
    console.log("[handleUserLogin] Syncing FocusStore");
    await useFocusStore.getState().initializeSessions(userId);
    
    console.log("[handleUserLogin] Syncing ProductivityStore");
    await useProductivityStore.getState().initializeMetrics(userId);
    
    console.log("[handleUserLogin] Syncing NotesStore");
    await useNotesStore.getState().syncNotes(userId);
    
    console.log("[handleUserLogin] Syncing TasksStore");
    await useTasksStore.getState().syncTasks(userId);
    
    console.log("[handleUserLogin] Syncing SettingsStore");
    await useSettingsStore.getState().syncSettings(userId);
    
    console.log("[handleUserLogin] Syncing IntelligenceStore");
    await useIntelligenceStore.getState().syncIntelligence(userId);
    
    console.log("[handleUserLogin] Finished sync successfully");
  } catch (e) {
    console.error("Error during sync:", e);
  } finally {
    console.log("[handleUserLogin] Setting initialized to true");
    isSyncing = false;
    hasSyncedForSession = true;
    useAuthStore.getState().setInitialized(true);
    useAuthStore.getState().setLoading(false);
  }
}

export async function loginWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return { success: false, error };
  }
}


export async function loginWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("EMAIL LOGIN ERROR:", error);
    return { success: false, error };
  }
}

export async function signupWithEmail(name: string, email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return { success: false, error };
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuthStore.getState().setUser(null);
    return { success: true };
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return { success: false, error };
  }
}