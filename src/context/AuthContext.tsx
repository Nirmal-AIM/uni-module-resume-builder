import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  getCurrentSession,
  getCurrentUser,
  initializeUserProfile,
  onAuthStateChange,
  signOut,
  type Profile,
} from '@/services/authService';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const existing = await getCurrentSession();
      if (!active) return;
      setSession(existing);
      if (existing) {
        const currentUser = await getCurrentUser();
        if (!active) return;
        setUser(currentUser);
        if (currentUser) {
          const p = await initializeUserProfile(currentUser);
          if (!active) return;
          setProfile(p);
        }
      }
      setLoading(false);
    })();

    const subscription = onAuthStateChange(async (newSession) => {
      if (!active) return;
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);
      if (newUser) {
        const p = await initializeUserProfile(newUser);
        if (!active) return;
        setProfile(p);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
