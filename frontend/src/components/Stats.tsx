import { PublicClient } from 'viem'
import { useAccount } from 'wagmi';

export function Stats({ publicClient, lastPresser }: { publicClient: PublicClient, lastPresser: string | null }) {

  const { address } = useAccount()

  function getLastPresser() {
    if (lastPresser) {
      if (address && address === lastPresser) {
        return 'you!'
      } else {
        return `${lastPresser.slice(0, 6)}...${lastPresser.slice(-4)}`;
      }
    } else {
      return 'loading..';
    }
  }

  return (
    <div className="card">
      <div className="card-body items-center text-center">
        { getLastPresser() }
      </div>
    </div>
  );
}