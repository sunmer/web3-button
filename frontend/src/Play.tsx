import { default as AbiWeb3Button } from './abi/contracts/Web3Button.sol/Web3Button.json';
import { parseEther } from 'viem';
import {
  useAccount,
  usePrepareContractWrite,
  useDisconnect,
  useContractWrite,
  useConnect
} from 'wagmi'

export function Play() {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const { config, error } = usePrepareContractWrite({
    address: '0x6ef081c8dea3afb466520975440a34fbea7d4133',
    abi: AbiWeb3Button.abi,
    functionName: 'press',
    value: parseEther('0.001'),
  })

  const { write } = useContractWrite(config)

  if (connector && isConnected) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl text-left">
        <div className="card-body">
          {
            address && (<div>Connected as {address.slice(0, 6)}...{address.slice(-4)}</div>)
          }
          <div className="card-actions justify-end">
            <button className="btn btn-primary" disabled={!write} onClick={() => write?.()}>
              Press
            </button>
            {error && (
              <div>An error occurred preparing the transaction: {error.message}</div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl text-left">
        <h2 className="card-title">Connectors</h2>
        <div className="card-body">
          <div>
            {connectors.map((connector) => (
              <button
                className="btn btn-primary"
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </button>
            ))}

            {error && <div>{error.message}</div>}
          </div>
        </div>
      </div>
    )
  }

}
