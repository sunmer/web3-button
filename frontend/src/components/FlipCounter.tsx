import { useState, useEffect } from 'react';
import { default as AbiWeb3Button } from '../abi/contracts/Web3Button.sol/Web3Button.json';
import { createPublicClient, http} from 'viem'
import { polygon } from 'viem/chains'


export function FlipCounter() {
  const [newNum, setNewNum] = useState<number>(10);
  const [oldNum, setOldNum] = useState<number>(9);
  const [change, setChange] = useState<boolean>(true);

  const publicClient = createPublicClient({
    chain: polygon,
    transport: http()
  })

  useEffect(() => {
    const timerID = setInterval(async () => {
      let lastPressTime = await publicClient.readContract({
        address: '0x6ef081c8dea3afb466520975440a34fbea7d4133',
        abi: AbiWeb3Button.abi,
        functionName: 'lastPressTimestamp',
      }) as bigint;

      const lastPress = (new Date().getTime() / 1000) - Number(lastPressTime)
      const secondsRounded = Math.round(lastPress);
      const firstNum = 60 - secondsRounded
      const secondNum = firstNum - 1;

      if (secondNum > 0) {
        setOldNum(firstNum);
        setNewNum(secondNum);
        setChange(!change);
      } else {
        setNewNum(0);
      }
      console.log(secondNum)
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, [newNum, change]);

  const animation1 = change ? 'fold' : 'unfold';
  const animation2 = !change ? 'fold' : 'unfold';
  const number1 = change ? oldNum : newNum;
  const number2 = !change ? oldNum : newNum;

  return (
    <div className="button-container card w-96">
      <div className="flipCounter">
        <div className="upperCard">
          <span>{newNum}</span>
        </div>
        <div className="lowerCard">
          <span>{oldNum}</span>
        </div>
        <div className={`flipCard first ${animation1}`}>
          <span>{number1}</span>
        </div>
        <div className={`flipCard second ${animation2}`}>
          <span>{number2}</span>
        </div>
      </div>
    </div>
  );
}
