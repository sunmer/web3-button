import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { ConnectKitButton } from "connectkit";
import { useEffect, useState, useCallback } from 'react';
import { Chain, parseEther } from 'viem';
import { polygon } from 'viem/chains'
import { CONTRACT_ADDRESS } from "../App"
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount
} from 'wagmi'

export function Button({ currentChain, lastPressTime, lastPresser }: { currentChain: Chain, lastPressTime: bigint | null, lastPresser: string | null }) {

  const { address } = useAccount();

  const [timer, setTimer] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  let { config: configClaim, error: errorClaim, refetch: refetchClaimPot } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS[currentChain.id] as `0x${string}`,
    abi: AbiWeb3Button.abi,
    functionName: 'claimPot',
  });

  let { write: writeClaim, isLoading: isLoadingClaimPot } = useContractWrite(configClaim);

  let { config: configPress, error: errorPress, refetch: refetchPressButton } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS[currentChain.id] as `0x${string}`,
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: currentChain.id === polygon.id ? parseEther('1') : parseEther('0.001'),
  });

  const { write: writePress, isLoading: isLoadingPress } = useContractWrite(configPress);

  const prepareContractWrites = () => {
    refetchClaimPot();
    refetchPressButton();
  };

  useEffect(() => {
    if (!document.hidden && address !== undefined) {
      if(lastPresser !== null && lastPresser !== address) {
        prepareContractWrites();
      } else {
        const timerID = setInterval(() => {
          prepareContractWrites();
        }, 2000);
        return () => clearInterval(timerID);
      }
    }
  }, [lastPresser, lastPressTime, currentChain]);
  
  const pressButton = () => {
    if (errorPress) {
      console.log(errorPress);
      return;
    }
    writePress?.();
  }

  const claimPot = () => {
    if (errorClaim) {
      console.log(errorClaim);
      return;
    }
    writeClaim?.();
  }

  const updateNumbers = useCallback(() => {
    const currentElapsedTime = (new Date().getTime() / 1000) - Number(lastPressTime);
    const elapsedSeconds = 60 - Math.round(currentElapsedTime);
    setTimer(Math.max(0, elapsedSeconds));
    setElapsedTime(currentElapsedTime);
    return currentElapsedTime;
  }, [lastPressTime]);

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
              Connect wallet
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    );
  } else if (isLoadingClaimPot || isLoadingPress || lastPresser === null || lastPressTime === null) {
    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg">
          <span className="loading loading-spinner"></span>
        </button>
      </div>
    );
  } else if (address !== lastPresser) {
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
