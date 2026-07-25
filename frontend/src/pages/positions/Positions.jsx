import { useContext, useState } from 'react';
import './Positions.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import { StatCard, StatCardMobile } from '../../components/ui/StatCard';
import { PositionsContext } from '../../context/PositionsContext';

function Positions() {

    const { enrichedPositions, positionsStats } = useContext(PositionsContext);

    return(
        <div className='positions'>
            <div className='stats'>
                <StatCard title={"Margin Used"} value={positionsStats.marginUsed} subTitle={"Capital Deployed"} />
                <StatCard title={"Position Value"} value={positionsStats.positionValue} subTitle={"Current Exposure"} />
                <StatCard title={"Pofit & Loss"} value={positionsStats.pnl} subTitle={"Unrealized PnL"} isPnL={true} roi={positionsStats.roi} />

                <StatCardMobile invested={5500} current={7500} pnl={2000} roi={2} />
            </div>

            <div className='position-items'>
                <TableContainer className='MUI-table'>
                    <Table className='positions-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Side</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Avg.</TableCell>
                                <TableCell>Lev.</TableCell>
                                <TableCell>LTP</TableCell>
                                <TableCell>P&L</TableCell>
                                <TableCell>ROI %</TableCell>
                                <TableCell>Liq. Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedPositions.map((position, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{position.symbol}</TableCell>
                                    <TableCell>{position.side}</TableCell>
                                    <TableCell>{position.quantity}</TableCell>
                                    <TableCell>{Number(Number(position.averagePrice).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(position.leverage).toFixed(1)).toLocaleString()}X</TableCell>
                                    <TableCell>{Number(Number(position.ltp).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell style={{color: position.pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(position.pnl).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(position.roi).toFixed(1)).toLocaleString()}%</TableCell>
                                    <TableCell>{Number(Number(position.liquidationPrice).toFixed(1)).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}


export default Positions;