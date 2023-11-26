import React, { useEffect } from "react";
import { createContext, useContext } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  useEffect(() => {});
}

export const useAuth = () => useContext(AuthContext);
