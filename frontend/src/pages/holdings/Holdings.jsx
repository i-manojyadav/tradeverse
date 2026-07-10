import { useContext, useState } from 'react';
import './Holdings.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import { HoldingsContext } from '../../context/HoldingsContext';
import { StatCard, StatCardMobile } from '../../components/ui/StatCard';

function Holdings() {

    const { enrichedHoldings, holdingsStats } = useContext(HoldingsContext);

    return (
        <div className='holdings'>
            <div className='holding-stat stats'>
                <StatCard title={"Invested"} value={holdingsStats.invested} subTitle={"Capital deployed"} />
                <StatCard title={"Current"} value={holdingsStats.currentValue} subTitle={"Current value"} />
                <StatCard title={"Profit & Loss"} value={holdingsStats.pnl} subTitle={"Unrealized"} isPnL={true} roi={holdingsStats.roi} />

                <StatCardMobile invested={holdingsStats.invested} current={holdingsStats.currentValue} pnl={holdingsStats.pnl} roi={holdingsStats.roi} />
            </div>
            
            <div className='holding-items'>
                <TableContainer className='MUI-table'>
                    <Table className='holdings-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Avg. Buy</TableCell>
                                <TableCell>LTP</TableCell>
                                <TableCell>Invested</TableCell>
                                <TableCell>Current</TableCell>
                                <TableCell>P&L</TableCell>
                                <TableCell>ROI (%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedHoldings.map((holding, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{holding.symbol}</TableCell>
                                    <TableCell>{holding.quantity}</TableCell>
                                    <TableCell>{Number(Number(holding.averageBuy).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(holding.ltp).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(holding.invested).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(holding.currentValue).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell style={{color: holding.pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(holding.pnl).toFixed(1)).toLocaleString()}</TableCell>
                                    <TableCell>{Number(Number(holding.roi).toFixed(1)).toLocaleString()}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}


export default Holdings;