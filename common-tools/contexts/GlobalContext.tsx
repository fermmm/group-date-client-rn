import React, { FC, useState } from "react";

interface GlobalContextTypings {
   automaticReLoginDone: boolean;
   setAutomaticReLoginDone?: (v: boolean) => void;
}

const defaultState = {
   automaticReLoginDone: false,
   setAutomaticReLoginDone: () => {}
};

export const GlobalContext = React.createContext<GlobalContextTypings>(defaultState);

export const GlobalContextProvider: FC = ({ children }) => {
   const [automaticReLoginDone, setAutomaticReLoginDone] = useState(
      defaultState.automaticReLoginDone
   );

   return (
      <GlobalContext.Provider
         value={{
            automaticReLoginDone,
            setAutomaticReLoginDone
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};
