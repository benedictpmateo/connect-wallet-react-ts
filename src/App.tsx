import React from "react";
import { AppProvider } from "./context/AppContext";
import Connect from './section/Connect';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="bg-[#DDE8B9] h-screen w-screen">
        <Connect />
      </div>
    </AppProvider>
  );
};

export default App;
