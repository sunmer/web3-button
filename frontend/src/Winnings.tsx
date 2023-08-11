import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { default as AbiWeb3Button } from './abi/contracts/Web3Button.sol/Web3Button.json';
import { createPublicClient, http } from 'viem'
import { polygon } from 'viem/chains'
import {
  useContractRead
} from 'wagmi'

export function Winnings() {
  
  const [winnings, setWinnings] = useState<bigint | null>(null);
  const [lastPresser, setLastPresser] = useState<string | null>(null);
  const [secondsSinceLastPress, setSecondsSinceLastPress] = useState<string | null>(null);

  const publicClient = createPublicClient({
    chain: polygon,
    transport: http()
  })
  
  useEffect(() => {
    const intervalID = setInterval(async () => {
      let lastPressTime = await publicClient.readContract({
        address: '0x6ef081c8dea3afb466520975440a34fbea7d4133',
        abi: AbiWeb3Button.abi,
        functionName: 'lastPressTimestamp',
      }) as bigint;

      const lastPresser = await publicClient.readContract({
        address: '0x6ef081c8dea3afb466520975440a34fbea7d4133',
        abi: AbiWeb3Button.abi,
        functionName: 'lastPresser',
      }) as string;

      const winnings = await publicClient.readContract({
        address: '0x6ef081c8dea3afb466520975440a34fbea7d4133',
        abi: AbiWeb3Button.abi,
        functionName: 'balance',
      }) as bigint;

      const lastPress = (new Date().getTime() / 1000) - Number(lastPressTime)
      setSecondsSinceLastPress(Math.round(lastPress).toString())
      setLastPresser(lastPresser);
      setWinnings(winnings);
    }, 1000);
  
    return () => clearInterval(intervalID);
  }, []);
  
  return (
    <div className="card w-96 bg-base-100 shadow-xl text-left">
      <div className="card-body">
        <div>
          {winnings ? (
            <p>Winnings at stake: {formatEther(winnings, 'wei')} Matic</p>
          ) : (
            <p>Loading winnings...</p>
          )}
        </div>
        <div>
          {winnings ? (
            <p>Last press: {secondsSinceLastPress}s ago</p>
          ) : (
            <p>Loading last press...</p>
          )}
        </div>
        <div>
          {lastPresser ? (
            <p>Last presser: {lastPresser.slice(0, 6)}...{lastPresser.slice(-4)}</p>
          ) : (
            <p>Loading last presser...</p>
          )}
        </div>
      </div>
    </div>
  );
}
