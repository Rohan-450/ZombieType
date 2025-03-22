import React, { useState } from "react";

export const ContextProvider = React.createContext();
function Context({ children }) {
  const [time, setTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(time);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ContextProvider.Provider
      value={{ time, setTime, isOpen, setIsOpen, timeLeft, setTimeLeft }}
    >
      {children}
    </ContextProvider.Provider>
  );
}

export default Context;
