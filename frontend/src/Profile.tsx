import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance
} from 'wagmi'

export function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { data } = useBalance({
    address: address,
  })
  const { disconnect } = useDisconnect()

  if (connector && isConnected) {
    return (
      <div>
        { address && (
            <div>Balance: {data?.formatted} {data?.symbol}</div>
          )
        }
        <div>${address}</div>
        <div>Connected to {connector.name}</div>
        <button onClick={ () => disconnect }>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
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
  )
}
