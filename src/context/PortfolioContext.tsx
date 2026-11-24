import React, { createContext, useContext } from "react";
import {
  PublicPortfolioData,
  DEFAULT_PORTFOLIO_DATA,
} from "../lib/portfolioService";

interface PortfolioContextType {
  data: PublicPortfolioData;
  isLoading: boolean;
  isSyncing: boolean;
  lastSynced: string;
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: DEFAULT_PORTFOLIO_DATA,
  isLoading: false,
  isSyncing: false,
  lastSynced: "",
  refetch: async () => {},
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PortfolioContext.Provider
      value={{
        data: DEFAULT_PORTFOLIO_DATA,
        isLoading: false,
        isSyncing: false,
        lastSynced: "",
        refetch: async () => {},
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => useContext(PortfolioContext);
