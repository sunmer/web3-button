import { useState } from 'react'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygon } from 'viem/chains'

import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { Play } from './Play'
import { Winnings } from './Winnings'
import SpaceEarn from "./SpaceEarn"

import './App.css'

function App() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygon],
    [publicProvider()],
  )

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'wagmi',
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  })

  return (
    <WagmiConfig config={config}>
    <div className="flex space-x-4 mb-4">
        <Play />
        <Winnings />
    </div>
    <div className="flex space-x-4">
      <SpaceEarn />
    </div>
    </WagmiConfig>
  )
}

export default App
