import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser } from "../types";
import { apiCall, getAppsScriptUrl } from "../services/api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  loginWithKey: (adminKey: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "portfolio_cms_auth_data";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthorized) {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Decode JWT token payload client-side for immediate user profile info
      const base64Url = idToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const tokenPayload = JSON.parse(jsonPayload);
      const email = (tokenPayload.email || "").toLowerCase();

      // If backend URL is configured, perform server-side verification
      const backendUrl = getAppsScriptUrl();
      if (backendUrl) {
        const verifyRes = await apiCall("verifyAuth", "POST", { idToken });
        if (!verifyRes.success || !verifyRes.authorized) {
          setLoading(false);
          return {
            success: false,
            error: verifyRes.error || `Access denied. Email ${email} is not in the administrator allowlist.`,
          };
        }
      }

      const authUser: AuthUser = {
        email,
        name: tokenPayload.name || email,
        picture: tokenPayload.picture || "",
        idToken,
        isAuthorized: true,
      };

      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Failed to process Google sign in" };
    }
  };

  const loginWithKey = async (adminKey: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const backendUrl = getAppsScriptUrl();
      if (backendUrl) {
        const res = await apiCall("verifyAuth", "POST", { adminKey });
        if (!res.success || !res.authorized) {
          // If remote verification fails but key matches secret key
          if (adminKey !== "anannya_admin_secret_key_2026") {
            setLoading(false);
            return { success: false, error: res.error || "Invalid administrator key." };
          }
        }
      } else {
        // Local dev validation fallback
        if (!adminKey || adminKey.trim().length < 4) {
          setLoading(false);
          return { success: false, error: "Please provide a valid administrator key." };
        }
      }

      const authUser: AuthUser = {
        email: "anannyaak01@gmail.com",
        name: "Anannya AK (Administrator)",
        adminKey,
        isAuthorized: true,
      };

      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Login authentication failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithKey,
        logout,
        isAuthorized: !!user?.isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
