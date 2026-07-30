import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface WalletState {
  address: string | null;
  balance: string | null;
  connected: boolean;
  connecting: boolean;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    connected: false,
    connecting: false,
  });

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, connecting: true }));
    try {
      // Simulate wallet connection - in production, use Midnight wallet SDK
      await new Promise(resolve => setTimeout(resolve, 1000));
      setState({
        address: '0x' + 'a'.repeat(40),
        balance: '100.0',
        connected: true,
        connecting: false,
      });
    } catch {
      setState(prev => ({ ...prev, connecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ address: null, balance: null, connected: false, connecting: false });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
