import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  function saveSession(dbUser) {
    // never keep the password in the session
    const { password, ...safeUser } = dbUser;
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
  }

  async function signup({ name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    const existing = await api.get("/users", {
      params: { email: cleanEmail },
    });

    if (existing.data.length > 0) {
      throw new Error("An account with this email already exists");
    }

    const response = await api.post("/users", {
      name: name.trim(),
      email: cleanEmail,
      password,
    });

    saveSession(response.data);
  }

  async function login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    const response = await api.get("/users", {
      params: { email: cleanEmail, password },
    });

    if (response.data.length === 0) {
      throw new Error("Invalid email or password");
    }

    saveSession(response.data[0]);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
