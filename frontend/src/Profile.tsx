import { default as AbiWeb3Button } from '../public/contracts/Web3Button.sol/Web3Button.json';
import { parseEther } from 'viem';
import {
  useAccount,
  useDisconnect,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead
} from 'wagmi'

export function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const { config, error } = usePrepareContractWrite({
    address: '0x3Bb9EaFFA5F7837e9fdF852FD5fc6F6eE440A9eE',
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: parseEther('0.001'),
  })

  const { write } = useContractWrite(config)

  if (connector && isConnected) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl text-left">
        <div className="card-body">
          <div>${address}</div>
          <div>Connected to {connector.name}</div>
          <button onClick={() => disconnect}>Disconnect</button>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" disabled={!write} onClick={() => write?.()}>
              Press
            </button>
            {error && (
              <div>An error occurred preparing the transaction: {error.message}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

}
