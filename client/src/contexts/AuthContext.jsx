import { createContext, useEffect, useState } from "react";
import { getUserDetails } from "../utils/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getUserDetails());
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }} >
      {children}
    </AuthContext.Provider>
  )
}