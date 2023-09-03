import { formatEther, Chain } from 'viem';
import { CONTRACT_ADDRESS, GameStatus } from "../App";
import { useEffect, useRef } from 'react';
import { polygon, base } from '@wagmi/chains';

export function Instructions({ chain, gameStatus }: { chain: Chain, gameStatus: GameStatus }) {

  const lastPresserRef = useRef<HTMLDivElement | null>(null);
  const prevLastPresserRef = useRef<string | null>(null);

  useEffect(() => {

    const blinkElement = () => {

      if (gameStatus[0] &&
        lastPresserRef.current &&
        prevLastPresserRef.current &&
        gameStatus[0] !== prevLastPresserRef.current) {

        lastPresserRef.current.classList.add("blink-border");

        setTimeout(() => {
          if (lastPresserRef.current) {
            lastPresserRef.current.classList.remove("blink-border");
          }
        }, 1000);
      }
    }

    blinkElement();
    prevLastPresserRef.current = gameStatus[0];
  }, [gameStatus]);

  function getLastPresser() {
    if (gameStatus[0]) {
      return `${gameStatus[0].slice(0, 6)}...${gameStatus[0].slice(-4)}`;
    } else {
      return 'loading..';
    }
  }

  if (chain && chain.blockExplorers) {
    if (chain.id === polygon.id) {
      return (
        <div className="max-w-xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light mb-5">
          Anyone can reset the 60-second timer by adding 0.5 Matic to the pot. If the timer reaches 0 on your click, you win the pot!
          <br /> <br />
          Current pot&nbsp;
          <div className="badge badge-accent text-lg px-2	p-3">
            {formatEther(gameStatus[2], "wei")} Matic
          </div> Last presser&nbsp;
          <div id="lastPresser" ref={lastPresserRef} className="badge badge-accent text-lg px-2 p-3">
            <a href={gameStatus[0] ? `${chain.blockExplorers.default.url}/address/${gameStatus[0]}` : '#'} target="_blank">{getLastPresser()}</a>
          </div>
          <p className="pt-5" style={{ marginTop: '80px', fontSize: '14px' }}>Inspired by <a href="https://en.wikipedia.org/wiki/The_Button_(Reddit)" className="underline" target="_blank">The Button</a>,<br /><a href={`${chain.blockExplorers.default.url}/address/${CONTRACT_ADDRESS[chain.id]}`} className="underline" target="_blank">Contract</a></p>
        </div>
      )
    } else if (chain.id === base.id) {
      return (
        <div className="max-w-xl mx-auto lg:text-xl text-gray-200 mt-3 leading-normal font-light mb-5">
          Anyone can reset the 60-second timer by adding 0.001 Eth to the pot. If the timer reaches 0 on your click, you win the pot!
          <br /> <br />
          Current pot&nbsp;
          <div className="badge badge-accent text-lg px-2	p-3">
            {formatEther(gameStatus[2], "gwei")} Eth
          </div> Last presser&nbsp;
          <div id="lastPresser" ref={lastPresserRef} className="badge badge-accent text-lg px-2 p-3">
            <a href={gameStatus[0] ? `${chain.blockExplorers.default.url}/address/${gameStatus[0]}` : '#'} target="_blank">{getLastPresser()}</a>
          </div>
          <p className="pt-5" style={{ marginTop: '80px', fontSize: '14px' }}>Inspired by <a href="https://en.wikipedia.org/wiki/The_Button_(Reddit)" className="underline" target="_blank">The Button</a>,<br /><a href={`${chain.blockExplorers.default.url}/address/${CONTRACT_ADDRESS[chain.id]}`} className="underline" target="_blank">Contract</a></p>
        </div>
      )
    }
  }


}