import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { PublicClient } from 'viem'

export function Intro({ publicClient }: { publicClient: PublicClient }) {

  const [winnings, setWinnings] = useState<bigint | null>(null);

  useEffect(() => {
    const intervalID = setInterval(async () => {

      const winnings = await publicClient.readContract({
        address: '0xfb13C6b0E683C9f963C21Cf503c82b6DA5aa6070',
        abi: AbiWeb3Button.abi,
        functionName: 'potBalance',
      }) as bigint;

      setWinnings(winnings);
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="max-w-xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light">
      Anyone can reset the 60-second timer and add 0.001 Eth to the pot. If the timer reaches 0 on your click, you win the pot! <br /> <br />  The current pot is&nbsp;
      <div className="badge badge-accent text-lg px-2	p-3">
        <span className="font-bold">{winnings ? formatEther(winnings, 'wei') : '0'}</span>
      </div> Eth
    </div>

  );
}