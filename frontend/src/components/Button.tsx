import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { ConnectKitButton } from "connectkit";
import { useEffect, useState, useCallback } from 'react';
import { Chain, parseEther } from 'viem';
import { CONTRACT_ADDRESS, GameStatus } from "../App"
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount
} from 'wagmi'
import { polygon } from '@wagmi/chains';

export function Button({ chain, gameStatus }: { chain: Chain, gameStatus: GameStatus }) {

  const { address } = useAccount();

  const [timer, setTimer] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isLoadingPress, setIsLoadingPress] = useState<boolean>(false);
  const [isLoadingClaim, setIsLoadingClaim] = useState<boolean>(false);

  let { config: configClaim, error: errorClaim, refetch: refetchClaimPot } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS[chain.id] as `0x${string}`,
    abi: AbiWeb3Button.abi,
    functionName: 'claimPot',
  });

  let { write: writeClaim, status: writeStatus } = useContractWrite(configClaim);

  let { config: configPress, error: errorPress, refetch: refetchPressButton } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS[chain.id] as `0x${string}`,
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: chain.id === polygon.id ? parseEther('0.5') : parseEther('0.001')
  });

  const { write: writePress } = useContractWrite(configPress);

  const prepareContractWrites = () => {
    refetchPressButton();
    refetchClaimPot();
  };

  useEffect(() => {
    if(address === gameStatus[0]) 
      setIsLoadingPress(false);

    if(gameStatus[0] === '0x0000000000000000000000000000000000000000')
      setIsLoadingClaim(false);

    prepareContractWrites();
  }, [chain, gameStatus]);

  useEffect(() => {
    console.log(writeStatus)
  }, [writeStatus]);

  const pressButton = async () => {
    // @ts-ignore
    gtag('event', 'click_button');

    if (errorPress) {
      console.log(errorPress);
      return;
    }

    setIsLoadingPress(true);

    writePress?.();
  }

  const claimPot = () => {
    if (errorClaim) {
      console.log(errorClaim);
      return;
    }

    setIsLoadingClaim(true);
    
    writeClaim?.();
  }

  const updateNumbers = useCallback(() => {
    const currentElapsedTime = (new Date().getTime() / 1000) - Number(gameStatus[1]);
    const elapsedSeconds = 60 - Math.round(currentElapsedTime);
    setTimer(Math.max(0, elapsedSeconds));
    setElapsedTime(currentElapsedTime);
    return currentElapsedTime;
  }, [gameStatus[1]]);

  useEffect(() => {
    const timerID = setInterval(() => {
      updateNumbers();
    }, 250);
    return () => clearInterval(timerID);
  }, [updateNumbers]);

  if (!address) {
    return (
      <div className="card w-96">
        <ConnectKitButton.Custom>
          {({ show }) => (
            <button className="btn btn-secondary btn-lg" onClick={show}>
              Reset timer
              <div className="flex flex-col p-2 bg-white rounded-box text-black">
                <span className="countdown font-mono">
                  <span style={{ "--value": timer } as React.CSSProperties}></span>
                </span>
              </div>
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    );
  } else if (isLoadingPress) {
    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg">
          Pressing button..
          <span className="loading loading-spinner"></span>
        </button>
      </div>
    );
  } else if (isLoadingClaim) {
    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg">
          Claiming pot..
          <span className="loading loading-spinner"></span>
        </button>
      </div>
    );
  } else if (address !== gameStatus[0]) {
    if (elapsedTime > 60 && elapsedTime <= 300) {
      return (
        <div className="card">
          <button className="btn btn-secondary btn-lg" disabled>
            Game has ended
          </button>
          <span className="mt-2">Waiting 5 mins for the pot to be claimed</span>
        </div>
      );
    }

    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg" disabled={!writePress} onClick={pressButton}>
          Reset timer
          <div className="flex flex-col p-2 bg-white rounded-box text-black">
            <span className="countdown font-mono">
              <span style={{ "--value": timer } as React.CSSProperties}></span>
            </span>
          </div>
        </button>
      </div>
    );
  } else {
    if (elapsedTime > 300) {
      return (
        <div className="card">
          <div className="card-body items-center text-center">
            <button className="btn btn-secondary btn-lg text-white" disabled={!writePress} onClick={pressButton}>
              Reset timer
            </button>
            <p>You were the last presser but the 5-minute claim window expired</p>
          </div>
        </div>
      );
    } else if (elapsedTime > 60) {
      return (
        <div className="card">
          <button className="btn btn-success btn-lg text-white" onClick={claimPot}>
            You won! Claim pot!
          </button>
        </div>
      );
    } else {
      return (
        <div className="card">
          <button className="btn btn-secondary btn-lg">
            You're winning!
            <div className="flex flex-col p-2 bg-white rounded-box text-black">
              <span className="countdown font-mono">
                <span style={{ "--value": timer } as React.CSSProperties}></span>
              </span>
            </div>
          </button>
        </div>
      );
    }
  }
}
