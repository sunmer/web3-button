import { useState } from 'react'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygon } from 'viem/chains'

import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { Play } from './Play'
import { Winnings } from './Winnings'

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
    <div>
      <div className="flex space-x-4">
        <div className="card w-96 bg-base-100 shadow-xl text-left">
          <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
        <WagmiConfig config={config}>
          <Play />
          <Winnings />
        </WagmiConfig>
      </div>
    </div>
  )
}

export default App
