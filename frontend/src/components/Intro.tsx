import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { PublicClient } from 'viem'
import { useAccount } from 'wagmi';

export function Intro({ publicClient, lastPresser }: { publicClient: PublicClient, lastPresser: string | null }) {

  const { address } = useAccount()
  const [winnings, setWinnings] = useState<bigint | null>(null);
  
  useEffect(() => {
    const intervalID = setInterval(async () => {

      const winnings = await publicClient.readContract({
        address: '0xc41C0bB4a52a5b655dDa3b2EA8cC4AA1FdbA6630',
        abi: AbiWeb3Button.abi,
        functionName: 'potBalance',
      }) as bigint;

      setWinnings(winnings);
    }, 1000);
  
    return () => clearInterval(intervalID);
  }, []);

  function getLastPresser() {
    if(lastPresser) {
      if(address && address === lastPresser) {
        return 'you!'
      } else {
        return `${lastPresser.slice(0, 6)}...${lastPresser.slice(-4)}`;
      }
    } else {
      return 'loading..';
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light">
      The 60-second timer resets each time the button is pressed. If the counter ever reaches 0, the last person who pressed the button wins the pot of <span className="font-bold"> {winnings ? formatEther(winnings, 'wei') : '?'}</span> Eth. Each button press costs 0.001 Eth which goes to the winning pot. The current last presser is {getLastPresser()}
    </div>
    
  );
}