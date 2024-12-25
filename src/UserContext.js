import { createContext, useState } from "react";

// Create the User Context
export const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    picture: localStorage.getItem("userPhoto") || "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
