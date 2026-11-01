import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { User } from "../types";
import api from "../../config/api"; // Adjust this import to your actual Axios file.

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;

        setToken(savedToken);
        setUser(parsedUser);
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    } catch {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      toast.success("Login successful");
      navigate("/");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error instanceof Error ? error.message : "Login failed");

      toast.error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      toast.success("Registration successful");
      navigate("/");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error instanceof Error ? error.message : "Registration failed");

      toast.error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    navigate("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const updatedUser = { ...currentUser, ...userData };

      localStorage.setItem("auth_user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
