import { ConnectKitButton } from "connectkit";
import { Config, PublicClient, WebSocketPublicClient, useAccount, useNetwork } from 'wagmi'
import { Chain, base, polygon } from 'viem/chains'
import { default as AbiWeb3Button } from './abi/contracts/Web3Button.sol/Web3Button.json';
import { Button } from "./components/Button"
import { useState, useEffect } from "react";
import { Instructions } from "./components/Instructions";
import './App.css'


export type GameStatus = [
  string,
  bigint,
  bigint
]

export const CONTRACT_ADDRESS: { [key: number]: string } = {
  [polygon.id]: "0x53080dFD98d5CdD93Ed0e2c21eeee5678F58A9Ca",
  [base.id]: "0x3EA29C7b4fE02FD8FD16e403A247969312b5F79B"
};

function App({ config }: { config: Config<PublicClient, WebSocketPublicClient> }) {

  const [gameStatus, setGameStatus] = useState<GameStatus | undefined>(undefined);
  const [chain, setChain] = useState<Chain>(polygon);
  const { chain: connectedChain } = useNetwork();
  const { isConnected } = useAccount()

  const fetchStats = async () => {
    if (document.hidden)
      return;

    const determineTargetChain = () => {
      if (isConnected && connectedChain) {
        return connectedChain;
      }
      return polygon;
    };
    
    let targetChain = determineTargetChain();
    setChain(targetChain)
    let gameStatus: GameStatus;

    gameStatus = await config.getPublicClient().readContract({
      address: CONTRACT_ADDRESS[targetChain.id] as `0x${string}`,
      abi: AbiWeb3Button.abi,
      functionName: 'gameStatus',

    }).catch(() => ['0x0000000000000000000000000000000000000000', 0n, 0n]) as GameStatus; 
    
    setGameStatus(gameStatus)
  };

  useEffect(() => {
    const timerID = setInterval(fetchStats, 1000);

    return () => clearInterval(timerID);
  }, [gameStatus]);

  return (
    <>
      <div className="navbar">
        <div className="flex-1">
          <a href="https://twitter.com/web3pushers" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
        </div>
        <div className="flex-none">
          <ConnectKitButton />
        </div>
      </div>
      <div className="text-center mx-auto inline-block">
        <h1 className="text-3xl lg:text-6xl leading-tight max-w-3xl font-bold tracking-tight mt-6 mx-auto bg-clip-text text-transparent bg-gradient-to-r from-[#9867f0] to-[#ed4e50] font-extrabold relative -top-px">
          Web3 Button
        </h1>
      </div>
      {gameStatus && chain && (
        <>
          <div className="flex space-x-4 justify-center items-center h-32">
            <Button chain={chain} gameStatus={gameStatus} />
          </div>
          <Instructions chain={chain} gameStatus={gameStatus} />
        </>
      )}
      {!gameStatus && (
        <div className="flex space-x-4 justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        )
      }
    </>
  )
}

export default App
