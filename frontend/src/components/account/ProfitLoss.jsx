import { useState } from 'react';
import './ProfitLoss.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import { useEffect } from 'react';
import AppAlert from '../ui/AppAlert';
import NoTradingActivity from '../emptyStates/NoTradingActivity';

const url = import.meta.env.VITE_API_URL;

function ProfitLoss() {

    const isMobile = window.innerWidth <= 768;
    const isDesktop = window.innerWidth > 768;

    const [ alert, setAlert ] = useState(null);

    const [ activeFilter, setActiveFilter ] = useState("ALL");
    const [ pnlData, setPnLData ] = useState([]);

    const [ holdingsPnL, setHoldingsPnL ] = useState([]);
    const [ positionsPnL, setPositionsPnL ] = useState([]);

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

    /** Fetch Profit & Loss Data */
    const getPnL = async () => {
        try {
            const response = await fetch(`${url}/profit-loss`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({
                    msg: data.message,
                    severity: "success"
                });
                setHoldingsPnL(data.holdings);
                setPositionsPnL(data.positions);

            } else {
                setAlert({
                    msg: data.message,
                    severity: "error"
                });
            }

        } catch(err) {
            setAlert({
                msg: err,
                severity: "error"
            });
        }
    }

    useEffect(() => {
        getPnL();
    }, []);


    /** Handle Profit & Loss Filter */
    useEffect(() => {
        if (!holdingsPnL.length && !positionsPnL.length) return;

        function updatedData(trades) {
            const updatedPnLData = trades.map((trade) => {

                const entryPrice = Number(trade.entryPrice ?? trade.averageBuy);
                const quantity = Number(trade.quantity ?? trade.totalQuantity);
                const leverage = Number(trade.leverage ?? 1);
                const pnl = Number(trade.pnl ?? 0);

                return {
                    symbol: trade.symbol,
                    side: trade.side || "BUY",
                    mode: trade.mode || "INVEST",
                    leverage,
                    entryPrice,
                    exitPrice: trade.exitPrice,
                    quantity,
                    pnl,
                    roi: (pnl / (entryPrice * quantity)) * 100 * leverage,
                    executedAt: trade.executedAt,
                    closedAt: trade.closedAt,
                }
            });

            setPnLData(updatedPnLData);
        }

        if (activeFilter === "ALL") {
            updatedData([...holdingsPnL, ...positionsPnL]);

        } else if (activeFilter === "HOLDINGS") {
            updatedData(holdingsPnL);

        } else if (activeFilter === "POSITIONS") {
            updatedData(positionsPnL);
        }

    }, [activeFilter, holdingsPnL, positionsPnL]);



    return (
        <>
        <div className='profit-loss'>
            { alert && <AppAlert msg={alert.msg} severity={alert.severity} /> }
            <div className='filter'>
                <button className={activeFilter === "ALL" ? "filter-btn-active" : "filter-btn"} onClick={() => setActiveFilter("ALL")}>All</button>
                <button className={activeFilter === "HOLDINGS" ? "filter-btn-active" : "filter-btn"} onClick={() => setActiveFilter("HOLDINGS")}>Holdings</button>
                <button className={activeFilter === "POSITIONS" ? "filter-btn-active" : "filter-btn"} onClick={() => setActiveFilter("POSITIONS")}>Positions</button>
            </div>

            {pnlData.length > 0 && isDesktop && <div className='pnl-statement'>
                <TableContainer className='MUI-table'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Side</TableCell>
                                <TableCell>Entry</TableCell>
                                <TableCell>Exit</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>P&L</TableCell>
                                <TableCell>ROI %</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pnlData.map((trade, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{new Date(trade.executedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{trade.symbol}</TableCell>
                                    <TableCell>{`${trade.mode} (${trade.leverage}x)`}</TableCell>
                                    <TableCell>{trade.side}</TableCell>
                                    <TableCell>{Number(Number(trade.entryPrice).toFixed(2)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(trade.exitPrice).toFixed(2)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(trade.quantity).toFixed(2)).toLocaleString()}</TableCell>
                                    <TableCell style={{color: Number(trade.pnl) >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(trade.pnl).toFixed(2)).toLocaleString()}</TableCell>
                                    <TableCell style={{color: Number(trade.pnl) >= 0 ? "#008000" : "#ff0000"}}>{Number(((Number(trade.pnl) / (Number(trade.entryPrice) * Number(trade.quantity))) * 100 * Number(trade.leverage)).toFixed(2)).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}

            {pnlData.length > 0 && isMobile && <div className='mobile-pnl-statement'>
                {pnlData.map((trade, idx) => (
                    <div className='mti' key={idx} onClick={() => handlePopup(trade)}>
                        <div className='mti-left'>
                            <p>
                                <span className='mti-symbol'>{trade.symbol}</span> <span className='mti-side' style={{color: trade.side === "BUY" ? "#008000" : "#ff0000"}}>{trade.side}</span>
                            </p>
                            <p>
                                <span>
                                    <span className='mti-title'>Entry.</span> <span className='mti-value'>{Number(Number(trade.entryPrice).toFixed(2)).toLocaleString()}</span>
                                </span>
                                ·
                                <span>
                                    <span className='mti-title'>Exit.</span> <span className='mti-value'>{Number(Number(trade.exitPrice).toFixed(2)).toLocaleString()}</span>
                                </span>
                                ·
                                <span>
                                    <span className='mti-title'>Qty.</span> <span className='mti-value'>{Number(Number(trade.quantity).toFixed(2)).toLocaleString()}</span>
                                </span>
                            </p>
                        </div>
                        <div className='mti-right'>
                            <p className='mti-price'>
                                <span style={{color: Number(trade.pnl) >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(trade.pnl).toFixed(2)).toLocaleString()}</span>
                            </p>
                            <p>
                                <span className='mti-value' style={{color: Number(trade.pnl) >= 0 ? "#008000" : "#ff0000"}}>{Number(Number((Number(trade.pnl) / (Number(trade.entryPrice) * Number(trade.quantity))) * 100 * Number(trade.leverage)).toFixed(2)).toLocaleString()}%</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>}

            {(isActive && isMobile) && <div className='pnl-overview'>
                <div className='overview-top'>
                    <p>
                        <span className='overview-symbol'>{curTrade.symbol}</span>
                        <span style={{color: curTrade.pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(curTrade.pnl).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p style={{color: "red"}}>
                        <i onClick={() => handlePopup()} className="fa-solid fa-xmark"></i>
                    </p>
                </div>
                <div className='overview-data'>
                    <p>
                        <span className='overview-title'>Entry Price</span>
                        <span className='overview-value'>{Number(Number(curTrade.entryPrice).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>Exit Price</span>
                        <span className='overview-value'>{Number(Number(curTrade.exitPrice).toFixed(2)).toLocaleString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>Quantity</span>
                        <span className='overview-value'>{Number(Number(curTrade.quantity).toFixed(2)).toLocaleString()}</span>
                    </p>
                    {curTrade.mode === "INVEST" && <p>
                        <span className='overview-title'>Leverage</span>
                        <span className='overview-value'>{curTrade.leverage}x</span>
                    </p>}
                    <p>
                        <span className='overview-title'>Executed At</span>
                        <span className='overview-value'>{new Date(curTrade.executedAt).toLocaleString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>Closed At</span>
                        <span className='overview-value'>{new Date(curTrade.closedAt).toLocaleString()}</span>
                    </p>
                </div>
            </div>}
        </div>
        {pnlData.length === 0 && <NoTradingActivity />}
        </>
    )
}


export default ProfitLoss;