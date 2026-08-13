import { useContext, useState } from 'react';
import './Positions.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import { StatCard, StatCardMobile } from '../../../components/ui/StatCard';
import { PositionsContext } from '../../../context/PositionsContext';
import MobileTradeItem from '../MobileTradeItem';

function Positions() {

    const { enrichedPositions, positionsStats } = useContext(PositionsContext);

    const isMobile = window.innerWidth <= 768;
    const isDesktop = window.innerWidth > 768;

    return(
        <div className='positions'>
            <div className='stats'>
                <StatCard title={"Margin Used"} value={positionsStats.marginUsed} subTitle={"Capital Deployed"} />
                <StatCard title={"Position Value"} value={positionsStats.positionValue} subTitle={"Current Exposure"} />
                <StatCard title={"Pofit & Loss"} value={positionsStats.pnl} subTitle={"Unrealized PnL"} isPnL={true} roi={positionsStats.roi} />

                <StatCardMobile invested={positionsStats.marginUsed} current={positionsStats.positionValue} pnl={positionsStats.pnl} roi={positionsStats.roi} isPosition={true} />
            </div>

            {isDesktop && <div className='position-items'>
                <TableContainer className='MUI-table'>
                    <Table className='positions-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Side</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Avg.</TableCell>
                                <TableCell>LTP</TableCell>
                                <TableCell>P&L</TableCell>
                                <TableCell>TGT</TableCell>
                                <TableCell>SL</TableCell>
                                <TableCell>Liq. Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedPositions.map((position, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{`${position.symbol} (${position.leverage}x)`}</TableCell>
                                    <TableCell>{position.side}</TableCell>
                                    <TableCell>{position.quantity}</TableCell>
                                    <TableCell>{Number(Number(position.averagePrice).toFixed(2)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(position.ltp).toFixed(2)).toLocaleString()}</TableCell>
                                    <TableCell style={{color: position.pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(position.pnl).toFixed(2)).toLocaleString()} ({Number(Number(position.roi).toFixed(2)).toLocaleString()}%)</TableCell>
                                    <TableCell>{(position.target === 0 ? "N/A" : `${Number(Number(position.target).toFixed(2).toLocaleString())}`)}</TableCell>
                                    <TableCell>{(position.stopLoss == 0 ? "N/A" : `${Number(Number(position.stopLoss).toFixed(1)).toLocaleString()}`)}</TableCell>
                                    <TableCell>{Number(Number(position.liquidationPrice).toFixed(1)).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}

            {isMobile && <div>
                <MobileTradeItem trades={enrichedPositions} />
            </div>}
        </div>
    )
}


export default Positions;