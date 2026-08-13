import { useEffect, useState } from 'react';
import './MobileTradeItem.css';
import { useMediaQuery } from '@mui/material';

function MobileTradeItem({ trades }) {

    const [ isActive, setIsActive ] = useState(false);
    const [ curTrade, setCurTrade ] = useState([]);

    function handlePopup(trade) {
        if (isActive) {
            setIsActive(false);
            return;
        }
        if (!trade) return;
        setCurTrade(trade);
        setIsActive(true);
    }



    return (
        <div className='mobile-trade-item'>
            <div className='mobile-trading-items'>
                {trades.map((trade, idx) => (
                    <div className='mti' onClick={() => handlePopup(trade)}>
                        <div className='mti-left'>
                            <p>
                                <span className='mti-symbol'>{trade.symbol}</span> {trade.side && <span className='mti-side' style={{color: trade.side === "BUY" ? "#008000" : "#ff0000"}}>{trade.side}</span>}
                            </p>
                            <p>
                                <span>
                                    <span className='mti-title'>Avg.</span> <span className='mti-value'>55</span>
                                </span>
                                ·
                                <span>
                                    <span className='mti-title'>Qty.</span> <span className='mti-value'>55</span>
                                </span>
                            </p>
                        </div>
                        <div className='mti-right'>
                            <p className='mti-price'>
                                <span style={{color: trade.pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(trade.pnl).toFixed(2)).toLocaleString()} ({Number(Number(trade.roi).toFixed(2)).toLocaleString()}%)</span>
                            </p>
                            <p>
                                <span className='mti-title'>LTP</span> <span className='mti-value'>{Number(Number(trade.ltp).toFixed(2)).toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            {isActive && <div className='trade-overview'>
                <div className='overview-top'>
                    <p>
                        <span className='overview-symbol'>{curTrade.symbol}</span>
                        <span>{Number(Number(curTrade.ltp).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p style={{color: "red"}}>
                        <i onClick={() => handlePopup()} className="fa-solid fa-xmark"></i>
                    </p>
                </div>
                <div className='overview-stats'>
                    <p>
                        <span className='overview-title'>Invested</span>
                        <span className='overview-value'>{Number(Number(curTrade.marginUsed || curTrade.invested).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>Current</span>
                        <span className='overview-value'>{Number(Number(curTrade.positionValue || curTrade.currentValue).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>P&L</span>
                        <span className='overview-value' style={{color: curTrade.pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(curTrade.pnl).toFixed(2)).toLocaleString()}</span>
                    </p>
                </div>
                <div className='overview-data'>
                    <p>
                        <span className='overview-title'>Entry Price</span>
                        <span className='overview-value'>{Number(Number(curTrade.averagePrice || curTrade.averageBuy).toFixed(2)).toLocaleString()}</span>
                    </p>
                    {curTrade.leverage && <p>
                        <span className='overview-title'>Leverage</span>
                        <span className='overview-value'>{Number(Number(curTrade.leverage).toFixed(2)).toLocaleString()}x</span>
                    </p>}
                    <p>
                        <span className='overview-title'>Target</span>
                        <span className='overview-value'>{Number(curTrade.target) === 0 ? "N/A" : Number(Number(curTrade.target).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>Stop Loss</span>
                        <span className='overview-value'>{Number(curTrade.stopLoss) === 0 ? "N/A" : Number(Number(curTrade.stopLoss).toFixed(2)).toLocaleString()}</span>
                    </p>
                    {curTrade.liquidationPrice && <p>
                        <span className='overview-title'>Liquidation Price</span>
                        <span className='overview-value'>{Number(Number(curTrade.liquidationPrice).toFixed(2)).toLocaleString()}</span>
                    </p>}
                </div>
            </div>}
        </div>
    )
}


export default MobileTradeItem;