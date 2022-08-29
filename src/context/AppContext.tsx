import React, { createContext, Dispatch, useContext, useReducer } from "react";
import update from "immutability-helper";

interface IAppState {
  isConnected?: boolean;
  isCorrectChain?: boolean;
  isMetamaskInstalled?: boolean;
  isWalletMultiple?: boolean;
  currentChain?: string;
  address?: string;
  errorMessage?: string;
  loading?: boolean;
}

const initialState: IAppState = {
  isConnected: false,
  isCorrectChain: false,
  isMetamaskInstalled: false,
  isWalletMultiple: false,
  currentChain: "",
  address: "",
  errorMessage: "",
  loading: false,
};

const AppContext = createContext<{ app: IAppState, update: Dispatch<IAppState> }>({
  app: initialState,
  update: () => ({}),
});

const reducer = (state: IAppState, payload: IAppState) => {
  const data: IAppState = payload;
  const dataKeys: string[] = Object.keys(data);
  const paramKeys: string[] = Object.keys(initialState);
  if (dataKeys.length) {
    if (dataKeys.every((i) => paramKeys.includes(i))) {
      return update(state, {
        $merge: {
          ...payload,
        },
      });
    } else {
      throw new Error("You added unwanted state: " + dataKeys.join(", "));
    }
  }
  return state;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [app, update] = useReducer(reducer, initialState, initializer);

  return (
    <AppContext.Provider value={{ app, update }}>
      {children}
    </AppContext.Provider>
  );
};

export const initializer = (initialValue = initialState) => initialValue;

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext };
