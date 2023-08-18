import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { PublicClient } from 'viem'

export function Intro({ publicClient }: { publicClient: PublicClient }) {

  const [winnings, setWinnings] = useState<bigint | null>(null);
  
  useEffect(() => {
    const intervalID = setInterval(async () => {

      const winnings = await publicClient.readContract({
        address: '0x6ef081c8dea3afb466520975440a34fbea7d4133',
        abi: AbiWeb3Button.abi,
        functionName: 'balance',
      }) as bigint;

      setWinnings(winnings);
    }, 1000);
  
    return () => clearInterval(intervalID);
  }, []);
  
  return (
    <div className="max-w-3xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light">
      Each press of the button restarts the 60 second timer. If you're the last person who pressed it when the timer reaches 0, you'll win 
      <span className="font-bold"> {winnings ? formatEther(winnings, 'wei') : '?'} Eth</span>. Each button press costs 0.001 Eth - of which 90% goes to the winning pot and 10% to the dev.
    </div>
    
  );
}