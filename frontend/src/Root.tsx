import { base, polygon } from 'viem/chains'
import App from './App.tsx'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from 'wagmi'

function Root() {
  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: "0a0b6f07a3a8536c4a4de2149c7c7369",
      appName: "Web3Button",
      chains: [polygon, base]
    }),
  );


  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <App config={config} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default Root;
