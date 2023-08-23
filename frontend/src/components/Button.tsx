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

  const { address } = useAccount()
  const [timer, setTimer] = useState<number>(0);

  const { config: configPress, error: errorPress } = usePrepareContractWrite({
    address: '0xc41C0bB4a52a5b655dDa3b2EA8cC4AA1FdbA6630',
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: parseEther('0.001'),
  })

  const { config: configClaim, error: errorClaim } = usePrepareContractWrite({
    address: '0xc41C0bB4a52a5b655dDa3b2EA8cC4AA1FdbA6630',
    abi: AbiWeb3Button.abi,
    functionName: 'claimPot',
  })

  const pressButton = () => {
    if (!errorPress) {
      writePress?.()
    } else {
      console.log(errorPress)
    }
  }

  const claimPot = () => {
    if (!errorClaim) {
      writeClaim?.()
    } else {
      console.log(errorClaim)
    }
  }

  const { write: writePress } = useContractWrite(configPress);
  const { write: writeClaim } = useContractWrite(configClaim);

  const updateNumbers = async () => {
    const elapsedTime = (new Date().getTime() / 1000) - Number(lastPressTime);
    const elapsedSeconds = 60 - Math.round(elapsedTime);

    if (elapsedSeconds > 0) {
      setTimer(elapsedSeconds);
    } else {
      setTimer(0);
    }
  };

  useEffect(() => {
    const timerID = setInterval(updateNumbers, 1000);
    return () => clearInterval(timerID);
  }, [lastPressTime]);

  if (address) {
    if (!lastPresser || !lastPressTime) {
      return (
        <div className="card">
          <button className="btn btn-lg">
            Loading...
          </button>
        </div>
      )
    } else if (address !== lastPresser) {
      return (
        <div className="card">
          <button className="btn btn-secondary btn-lg" disabled={!writePress} onClick={() => pressButton()}>
            Reset timer
            <div className="flex flex-col p-2 bg-white rounded-box text-black">
              <span className="countdown font-mono">
                <span style={{ "--value": timer }}></span>
              </span>
            </div>
          </button>
        </div>
      )
    } else if (address === lastPresser) {
      const timestamp = new Date().getTime() / 1000;
      if (timestamp - Number(lastPressTime) > 300) {
        return (
          <div className="card">
            <div className="card-body items-center text-center">
              <div className="card-actions">
                <button className="btn btn-secondary btn-lg text-white" disabled={!writePress} onClick={() => pressButton()}>
                  Reset timer
                </button>
              </div>
              <p>Your pot has expired, it is only claimable for a 5 minute duration after you've won</p>
            </div>
          </div>
        )
      } else if (timestamp - Number(lastPressTime) > 60) {
        return (
          <div className="card">
            <button className="btn btn-success btn-lg text-white" onClick={() => claimPot()}>
              Claim pot
            </button>
          </div>
        )
      } else {
        return (
          <div className="card">
            <button className="btn btn-secondary btn-lg" onClick={() => claimPot()}>
              In the lead
              <div className="flex flex-col p-2 bg-white rounded-box text-black">
                <span className="countdown font-mono">
                  <span style={{ "--value": timer }}></span>
                </span>
              </div>
            </button>
          </div>
        )
      }
    }
  } else {
    return (
      <div className="card w-96">
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <button className="btn btn-secondary btn-lg" onClick={show}>
                Connect wallet
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    )
  }

}
