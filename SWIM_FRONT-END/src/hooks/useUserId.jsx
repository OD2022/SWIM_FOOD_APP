// useUserId.js
import { createContext, useContext, useState } from "react";

const UserIdContext = createContext(null);

export const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Log userId whenever it changes
  console.log("Current userId:", userId);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};

export const useUserId = () => {
  return useContext(UserIdContext);
};
