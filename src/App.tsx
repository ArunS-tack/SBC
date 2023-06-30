import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { FC, ReactNode, useCallback, useMemo, useState, useEffect } from 'react';

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new UnsafeBurnerWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

function Header() {
    return (
        <div>
            <h1>SOLANA BALANCE CHECKER</h1>
        </div>
    );
}

function Balance() {

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);

    const getBalance = async () => {
        if (!publicKey) return;
        const balance = await connection.getBalance(publicKey);
        setBalance(balance);
    };
        
    useEffect(() => {
        getBalance();
    }
    , [publicKey, connection]);

    return (
        <div>
            { publicKey ? (balance ? <h2>Balance: {balance / LAMPORTS_PER_SOL} SOL</h2> : <h2>Loading balance...</h2>) : <h2> Connect wallet to view balance </h2> }
        </div>
    );
}

const Content: FC = () => {
    return (
        <div className="App">
            <Header />
            <WalletMultiButton />
            <Balance />
        </div>
    );
};

