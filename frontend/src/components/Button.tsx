import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { ConnectKitButton } from "connectkit";
import { parseEther } from 'viem';
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount
} from 'wagmi'

export function Button() {

  const { address } = useAccount()

  const { config, error } = usePrepareContractWrite({
    address: '0xc41C0bB4a52a5b655dDa3b2EA8cC4AA1FdbA6630',
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: parseEther('0.001'),
  })

  const pressButton = () => {
    if (!error) {
      write?.()
    } else {
      console.log(error)
    }
  }

  const { write } = useContractWrite(config)

  if (address) {
    return (
      <div className="card">
        <button className="button text-4xl lg:text-5xl w-max" disabled={!write} onClick={() => pressButton()}>
          Press me! 
          <svg className="inline" viewBox="0 0 60 60" height="96px" width="96px">
            <path
              fill="currentColor"
              d="M10.68 8.936h4v5.114a14 14 0 11-2.074 20.022l3.238-2.37a10 10 0 101.652-14.768h5.182v4h-12v-12z"
            />
          </svg>
        </button>
      </div>
    )
  } else {
    return (
      <div className="card w-96">
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <button className="button text-4xl lg:text-5xl w-max" onClick={show} >
                Connect wallet
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    )
  }

}
