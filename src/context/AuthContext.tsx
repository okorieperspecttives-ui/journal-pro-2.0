import { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Initial session:", data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event, "Session:", session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Google login
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin, // ensures session comes back to your app
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google login error:", err.message);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOut, setLoading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
