import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount
} from 'wagmi'

export function Button({ lastPressTime, lastPresser }: { lastPressTime: bigint | null, lastPresser: string | null }) {

  const { address } = useAccount();
  const [timer, setTimer] = useState<number>(0);

  const { config: configPress, error: errorPress } = usePrepareContractWrite({
    address: '0x7928dE0791424936EC018e559F407B09c91265C5',
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: parseEther('0.001'),
  });

  const { config: configClaim, error: errorClaim } = usePrepareContractWrite({
    address: '0x7928dE0791424936EC018e559F407B09c91265C5',
    abi: AbiWeb3Button.abi,
    functionName: 'claimPot',
  });

  const { write: writePress, isLoading } = useContractWrite(configPress);
  const { write: writeClaim } = useContractWrite(configClaim);

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

  const updateNumbers = () => {
    const elapsedTime = (new Date().getTime() / 1000) - Number(lastPressTime);
    const elapsedSeconds = 60 - Math.round(elapsedTime);

    setTimer(Math.max(0, elapsedSeconds));
  };

  useEffect(() => {
    const timerID = setInterval(updateNumbers, 250);
    return () => clearInterval(timerID);
  }, [lastPressTime]);

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
  }

  const timestamp = new Date().getTime() / 1000;
  const elapsedTime = timestamp - Number(lastPressTime);

  if (isLoading || lastPresser === null || lastPressTime === null) {
    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg">
          <span className="loading loading-spinner"></span>
        </button>
      </div>
    );
  }

  if (lastPresser === "0x0000000000000000000000000000000000000000") {
    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg" onClick={pressButton}>
          Start Game
        </button>
      </div>
    );
  }

  if (address !== lastPresser) {
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
              <span style={{ "--value": timer }  as React.CSSProperties}></span>
            </span>
          </div>
        </button>
      </div>
    );
  }

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
  }

  if (elapsedTime > 60) {
    return (
      <div className="card">
        <button className="btn btn-success btn-lg text-white" onClick={claimPot}>
          You won! Claim pot!
        </button>
      </div>
    );
  }

  if (address === lastPresser) {
    return (
      <div className="card">
        <button className="btn btn-secondary btn-lg">
          You're winning!
          <div className="flex flex-col p-2 bg-white rounded-box text-black">
            <span className="countdown font-mono">
              <span style={{ "--value": timer }  as React.CSSProperties}></span>
            </span>
          </div>
        </button>
      </div>
    );
  }
  
}
