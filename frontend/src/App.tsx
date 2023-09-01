import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from 'wagmi'
import { Chain, base, polygon } from 'viem/chains'
import { default as AbiWeb3Button } from './abi/contracts/Web3Button.sol/Web3Button.json';
import { formatEther } from 'viem';
import { Button } from "./components/Button"

import './App.css'
import { useState, useEffect, useRef } from "react";

type GameStatus = [
  string,
  bigint,
  bigint
]

export const CONTRACT_ADDRESS: { [key: number]: string } = {
  [polygon.id]: "0xAaf8d7412120173BbcF7F919065F710f3Ac32E78",
  [base.id]: "0x3EA29C7b4fE02FD8FD16e403A247969312b5F79B"
};

function App() {

  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: "0a0b6f07a3a8536c4a4de2149c7c7369",
      appName: "Web3Button",
      chains: [polygon, base]
    }),
  );

  function getLastPresser() {
    if (lastPresser) {
      return `${lastPresser.slice(0, 6)}...${lastPresser.slice(-4)}`;
    } else {
      return 'loading..';
    }
  }

  const lastPresserRef = useRef<HTMLDivElement | null>(null);
  const prevLastPresserRef = useRef<string | null>(null);

  const [lastPresser, setLastPresser] = useState<string | null>(null);
  const [lastPressTimestamp, setLastPressTimestamp] = useState<bigint | null>(null);
  const [potBalance, setPotBalance] = useState<bigint | null>(null);
  const [currentChain, setCurrentChain] = useState<Chain>(polygon);
  const [contractAddress, setCurrentContractAddress] = useState(CONTRACT_ADDRESS[polygon.id]);

  const fetchStats = async () => {
    if (!document.hidden) {
      await setChain();

      let gameStatus = await config.getPublicClient().readContract({
        address: contractAddress as `0x${string}`,
        abi: AbiWeb3Button.abi,
        functionName: 'gameStatus',
      }) as GameStatus;

      if (gameStatus) {
        setLastPresser(gameStatus[0]);
        setLastPressTimestamp(gameStatus[1]);
        setPotBalance(gameStatus[2]);
      }
    }
  };

  const setChain = async () => {
    let walletClient = await config.connector?.getWalletClient();

    if (walletClient) {
      const chainID = await walletClient.getChainId();
      if (chainID === polygon.id) {
        setCurrentChain(polygon)
        setCurrentContractAddress(CONTRACT_ADDRESS[polygon.id])
      } else if (chainID === base.id) {
        setCurrentChain(base)
        setCurrentContractAddress(CONTRACT_ADDRESS[base.id])
      }
    }
  }

  useEffect(() => {
    const blinkElement = () => {
      if (lastPresser &&
        lastPresserRef.current &&
        prevLastPresserRef.current &&
        lastPresser !== prevLastPresserRef.current) {

        lastPresserRef.current.classList.add("blink-border");

        setTimeout(() => {
          if (lastPresserRef.current) {
            lastPresserRef.current.classList.remove("blink-border");
          }
        }, 1000);
      }
    }

    blinkElement();
    prevLastPresserRef.current = lastPresser;

    const timerID = setInterval(fetchStats, 1000);

    return () => clearInterval(timerID);
  }, [lastPresser, lastPressTimestamp, potBalance]);

  return (
    <>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
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
          <div className="flex space-x-4 justify-center items-center h-32">
            <Button currentChain={currentChain} lastPressTime={lastPressTimestamp} lastPresser={lastPresser} />
          </div>

          <div className="max-w-xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light mb-5">
            Anyone can reset the 60-second timer by adding {currentChain.id === polygon.id ? "1 Matic" : " 0.001 Eth"} to the pot. If the timer reaches 0 on your click, you win the pot!
            <br /> <br />
            Current pot&nbsp;
            {currentChain && currentChain.blockExplorers &&
              <>
                <div className="badge badge-accent text-lg px-2	p-3">
                  {potBalance ? formatEther(potBalance, currentChain.id === polygon.id ? "wei" : "gwei") : '0'} {currentChain.id === polygon.id ? "Matic" : "Eth"}
                </div> Last presser&nbsp;
                <div id="lastPresser" ref={lastPresserRef} className="badge badge-accent text-lg px-2 p-3">
                  <a href={lastPresser ? `${currentChain.blockExplorers.default.url}/address/${lastPresser}` : '#'} target="_blank">{getLastPresser()}</a>
                </div>
              </>
            }


            <p className="pt-5" style={{ marginTop: '80px', fontSize: '14px' }}>Inspired by <a href="https://en.wikipedia.org/wiki/The_Button_(Reddit)" className="underline" target="_blank">The Button</a>,<br /><a href={`${currentChain.blockExplorers?.default.url}/address/${CONTRACT_ADDRESS[currentChain.id]}`} className="underline" target="_blank">Contract</a></p>
          </div>

        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}

export default App
