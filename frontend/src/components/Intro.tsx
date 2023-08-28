import { formatEther } from 'viem';

export function Intro({ winnings }: { winnings: bigint }) {

  return (
    <div className="max-w-xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light">
      Anyone can reset the 60-second timer and add 0.001 Eth to the pot. If the timer reaches 0 on your click, you win the pot! <br /> <br />  The current pot is&nbsp;
      <div className="badge badge-accent text-lg px-2	p-3">
        <span className="font-bold">{winnings ? formatEther(winnings, 'wei') : '0'}</span>
      </div> Eth
    </div>

  );
}