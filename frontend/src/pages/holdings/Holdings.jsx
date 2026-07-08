import { useState } from 'react';
import './Holdings.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function Holdings() {

    const [ holdings, setHoldings ] = useState([
        {
            instrument: "HDFC Bank",
            quantity: "55",
            average: "45",
            ltp: "800",
            curValue: "790",
        },
    ]);

    return (
        <div className='holdings'>
            <div className='holding-stat stats'>
            </div>
            
            <div className='holding-items'>
                <TableContainer>
                    <Table className='holdings-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Instrument</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Avg. Cost</TableCell>
                                <TableCell>LTP</TableCell>
                                <TableCell>Cur. Val</TableCell>
                                <TableCell>P&L</TableCell>
                                <TableCell>Net Chg.</TableCell>
                                <TableCell>Day Chg.</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {holdings.map((holding, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{holding.instrument}</TableCell>
                                    <TableCell>{holding.quantity}</TableCell>
                                    <TableCell>{holding.average}</TableCell>
                                    <TableCell>{holding.ltp}</TableCell>
                                    <TableCell>{holding.curValue}</TableCell>
                                    <TableCell>{(Number(holding.ltp) - Number(holding.average)) * Number(holding.quantity)}</TableCell>
                                    <TableCell>{}</TableCell>
                                    <TableCell>{}</TableCell>
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