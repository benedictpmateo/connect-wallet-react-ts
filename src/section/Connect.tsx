import React from "react";
import Button from "../components/Button";
import { useAppContext } from "../context/AppContext";
import { useMetamaskConnect } from "../hooks/useMetamaskConnect";

const Connect: React.FC = () => {
  const { app } = useAppContext();
  const { connectWallet, isConnected } = useMetamaskConnect();

  const onConnect = () => {
    connectWallet();
  };

  const onInstallMetamask = () => {
    // Metamask Chrome Extension URL
    window.open(
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
      "blank"
    );
  };

  return (
    <div className="bg-[#DDE8B9] h-screen w-screen p-[60px] max-w-[760px] mx-auto">
      <div>
        <div className="font-baskil text-[40px] leading-[40px] sm:text-[80px] sm:leading-[80px] font-bold max-w-[1000px]">
          {!app.isMetamaskInstalled && (
            <span className="text-[#796465]">
              Please install Metamask Wallet
            </span>
          )}
          {!isConnected && app.isMetamaskInstalled && (
            <span className="text-[#796465]">
              Connect your Metamask crypto wallet
            </span>
          )}
          {isConnected && (
            <span className="text-[#796465]">You are connected!</span>
          )}
        </div>
        <div className="mt-10 sm:mt-20">
          {!app.isMetamaskInstalled && (
            <Button label="Install Metamask" onClick={onInstallMetamask} />
          )}
          {!isConnected && app.isMetamaskInstalled && (
            <Button label="Connect Wallet" onClick={onConnect} />
          )}
          {isConnected && (
            <>
              <p className="text-2xl font-baskil">Here's your wallet:</p>
              <p className="bg-[#CB8589] mt-4 p-5 text-white font-baksil text-2xl break-words border-white border-[4px]">
                {app.address}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connect;
