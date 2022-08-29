import { useEffect, useCallback, useMemo } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useAppContext } from "../context/AppContext";
import { config } from "../constant";

interface IWeb3Error {
  code: number;
}

export const useMetamaskConnect = () => {
  const { app, update } = useAppContext();

  const isConnected = useMemo(
    () =>
      app.isConnected &&
      app.isCorrectChain &&
      app.address &&
      app.isMetamaskInstalled &&
      !app.isWalletMultiple,
    [
      app.address,
      app.isConnected,
      app.isCorrectChain,
      app.isMetamaskInstalled,
      app.isWalletMultiple,
    ]
  );

  const isMetaMaskInstalled = (): boolean => {
    if (typeof window !== "undefined") {
      return Boolean(window.ethereum);
    }
    return false;
  };

  useEffect(() => {
    update({
      loading: true,
    });
    if (isMetaMaskInstalled()) {
      getProvider();

      window.ethereum.on("chainChanged", () => window.location.reload());
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        window.ethereum.removeListener("chainChanged", () =>
          window.location.reload()
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProvider = async () => {
    const provider = await detectEthereumProvider();
    update({
      isMetamaskInstalled: Boolean(provider),
      isWalletMultiple: provider !== window.ethereum,
      errorMessage: "",
    });
  };

  const handleChainChanged = (_chainId: string) => {
    let currentLoading = {};
    if (_chainId !== config.chain) {
      currentLoading = { loading: false };
    }
    update({
      isCorrectChain: _chainId === config.chain,
      currentChain: _chainId,
      errorMessage: "",
      ...currentLoading,
    });
  };

  const handleAccountsChanged = useCallback(
    (accounts: string[], address?: string) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        update({
          isConnected: false,
          errorMessage: "",
        });
      } else if (accounts[0] !== address) {
        update({
          isConnected: true,
          address: accounts[0],
          errorMessage: "",
        });
      }
    },
    [update]
  );

  const handleDisconnect = async (error: IWeb3Error) => {
    if (error) {
      handleErrorMessage(error);
    }
    update({
      // web3 connection3
      isConnected: false,
      isCorrectChain: false,
      isMetamaskInstalled: false,
      isWalletMultiple: false,
      currentChain: "",
      address: "",
      loading: false,
    });
  };

  const handleErrorMessage = (error: IWeb3Error) => {
    let errorMessage = "";
    if (error) {
      switch (error.code) {
        case 4001: {
          errorMessage = "Rejected request. Please connect to MetaMask.";
          break;
        }
        case -32002: {
          errorMessage = "Please check your Metamask for pending request.";
          break;
        }
        case -32602: {
          errorMessage = "Invalid request parameters";
          break;
        }
        case -32603: {
          errorMessage = "Internal error. Please refresh your browser";
          break;
        }
        default: {
          errorMessage = "";
          break;
        }
      }
    }

    update({
      errorMessage,
    });
  };

  const startApp = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    handleChainChanged(chainId);

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    handleAccountsChanged(accounts, "");
  };

  useEffect(() => {
    if (app.isMetamaskInstalled && !app.isWalletMultiple) {
      startApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.isMetamaskInstalled, app.isWalletMultiple]);

  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.on("accountsChanged", (acc: string[]) =>
        handleAccountsChanged(acc, app.address)
      );
    }

    return () => {
      window?.ethereum?.removeListener("accountsChanged", (acc: string[]) =>
        handleAccountsChanged(acc, app.address)
      );
    };
  }, [app.address, handleAccountsChanged]);

  useEffect(() => {
    if (app.isConnected && app.isCorrectChain && app.address) {
      update({
        errorMessage: "",
        loading: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.address, app.isConnected, app.isCorrectChain]);

  const connectWallet = async () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        handleAccountsChanged(accounts, "");
      })
      .catch((err: IWeb3Error) => {
        handleErrorMessage(err);
      });
  };

  return { connectWallet, isConnected };
};
