import { useState, useEffect } from 'react';

export function FlipCounter() {
    const [newNum, setNewNum] = useState<number>((new Date()).getSeconds() === 0 ? 60 : (new Date()).getSeconds());
    const [oldNum, setOldNum] = useState<number>((new Date()).getSeconds() - 1 === -1 ? 59 : (new Date()).getSeconds() - 1);
    const [change, setChange] = useState<boolean>(true);

    useEffect(() => {
        const timerID = setInterval(() => {
            const currentNewNum = (new Date()).getSeconds() === 0 ? 60 : (new Date()).getSeconds();
            if (newNum !== currentNewNum) {
                const currentOldNum = currentNewNum - 1 === 0 ? 60 : currentNewNum - 1;
                setNewNum(currentNewNum);
                setOldNum(currentOldNum);
                setChange(!change);
            }
        }, 50);

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
