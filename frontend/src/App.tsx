import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

import { WagmiConfig, createConfig, useAccount } from 'wagmi'
import { polygon } from 'viem/chains'
import { default as AbiWeb3Button } from './abi/contracts/Web3Button.sol/Web3Button.json';
import { formatEther } from 'viem';
import { Button } from "./components/Button"

import './App.css'
import { useState, useEffect } from "react";

function App() {

  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: "0a0b6f07a3a8536c4a4de2149c7c7369",
      appName: "Web3Button",
      chains: [polygon]
    }),
  );

  function getLastPresser() {
    if (lastPresser) {
      return `${lastPresser.slice(0, 6)}...${lastPresser.slice(-4)}`;
    } else {
      return 'loading..';
    }
  }

  const [lastPressTime, setLastPressTime] = useState<bigint | null>(null);
  const [lastPresser, setLastPresser] = useState<string | null>(null);
  const [winnings, setWinnings] = useState<bigint | null>(null);

  useEffect(() => {
    const intervalID = setInterval(async () => {

      const winnings = await config.getPublicClient().readContract({
        address: '0xfb13C6b0E683C9f963C21Cf503c82b6DA5aa6070',
        abi: AbiWeb3Button.abi,
        functionName: 'potBalance',
      }) as bigint;

      setWinnings(winnings);
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  const fetchStats = async () => {
    let fetchedTime = await config.getPublicClient().readContract({
      address: '0xfb13C6b0E683C9f963C21Cf503c82b6DA5aa6070',
      abi: AbiWeb3Button.abi,
      functionName: 'lastPressTimestamp',
    }) as bigint;

    setLastPressTime(fetchedTime);

    const lastPresser = await config.getPublicClient().readContract({
      address: '0xfb13C6b0E683C9f963C21Cf503c82b6DA5aa6070',
      abi: AbiWeb3Button.abi,
      functionName: 'lastPresser',
    }) as string;

    setLastPresser(lastPresser);
  };

  useEffect(() => {
    const timerID = setInterval(fetchStats, 1000);

    return () => clearInterval(timerID);
  }, []);

  return (
    <>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <div className="navbar">
            <div className="flex-1">
              <a href="https://twitter.com/web3button" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
            </div>
            <div className="flex-none">
              <ConnectKitButton publicClient={config.getPublicClient()} />
            </div>
          </div>
          <div className="text-center mx-auto inline-block">
            <h1 className="text-3xl lg:text-6xl leading-tight max-w-3xl font-bold tracking-tight mt-6 mx-auto bg-clip-text text-transparent bg-gradient-to-r from-[#9867f0] to-[#ed4e50] font-extrabold relative -top-px">
              Web3 Button
            </h1>
          </div>
          <div className="flex space-x-4 justify-center items-center h-32">
            <Button lastPressTime={lastPressTime} lastPresser={lastPresser} />
          </div>
          <div className="max-w-xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light">
            Anyone can reset the 60-second timer and add 0.001 Eth to the pot. If the timer reaches 0 on your click, you win the pot!
            <br /> <br />
            Current pot&nbsp;
            <div className="badge badge-accent text-lg px-2	p-3">
              {winnings ? formatEther(winnings, 'wei') : '0'} Eth
            </div> Last presser&nbsp;
            <div className="badge badge-accent text-lg px-2	p-3">
              {getLastPresser()}
            </div>

          </div>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}

export default App
