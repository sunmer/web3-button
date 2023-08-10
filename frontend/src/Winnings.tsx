import { useState } from 'react';
import { default as AbiWeb3Button } from '../public/contracts/Web3Button.sol/Web3Button.json';
import {
  useContractRead
} from 'wagmi'

export function Winnings() {
  
  const [winnings, setWinnings] = useState<BigInt | null>(null);

  useContractRead({
    address: '0x3Bb9EaFFA5F7837e9fdF852FD5fc6F6eE440A9eE',
    abi: AbiWeb3Button.abi,
    functionName: 'balance',
    onSuccess: (data) => {
      console.log(data)
      setWinnings(data as BigInt)
    }
  })

  return (
    <div className="card w-96 bg-base-100 shadow-xl text-left">
      <div className="card-body">
        <div>
          {winnings ? (
            <p>Winnings: {winnings.toString()}</p>
          ) : (
            <p>Loading winnings...</p>
          )}
        </div>
      </div>
    </div>
  );
}
