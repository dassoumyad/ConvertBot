import { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext();


// Provider
export const AuthProvider = ({ children }) => {

  // Get token from localStorage
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );


  // Login function
  const login = (newToken) => {

    localStorage.setItem("token", newToken);

    setToken(newToken);
  };


  // Logout function
  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);
  };


  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: !!token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};