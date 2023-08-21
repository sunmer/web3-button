import { useState, useEffect } from 'react';


export function FlipCounter({ lastPressTime }: { lastPressTime: bigint | null }) {

  const [newNum, setNewNum] = useState<number>(0);
  const [oldNum, setOldNum] = useState<number>(0);
  const [change, setChange] = useState<boolean>(true);

  const updateNumbers = async () => {
    const elapsedSeconds = (new Date().getTime() / 1000) - Number(lastPressTime);
    const firstNum = 60 - Math.round(elapsedSeconds);
    const secondNum = firstNum - 1;

    if (secondNum > 0) {
      setOldNum(firstNum);
      setNewNum(secondNum);
      setChange(!change);
    } else {
      setNewNum(0);
    }
  };

  useEffect(() => {
    const timerID = setInterval(updateNumbers, 1000);
    return () => clearInterval(timerID);
  }, [newNum, change, lastPressTime]);

  const animation = change ? ['fold', 'unfold'] : ['unfold', 'fold'];

  return (
    <div className="button-container card">
      <div className="flipCounter">
        <div className="upperCard"><span>{newNum}</span></div>
        <div className="lowerCard"><span>{oldNum}</span></div>
        <div className={`flipCard first ${animation[0]}`}><span>{change ? oldNum : newNum}</span></div>
        <div className={`flipCard second ${animation[1]}`}><span>{change ? newNum : oldNum}</span></div>
      </div>
    </div>
  );
}
