import { useState } from 'react';
import './Positions.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function Positions() {

    const [ positions, setPositions ] = useState([
        {
            product: "NRML",
            instrument: "HDFC Bank",
            quantity: "55",
            average: "45",
            ltp: "800",
            pnl: "5",
            change: "790",
        },
    ]);


    return(
        <div className='positions'>
            <h3>Positions</h3>
            <TableContainer>
                <Table className='positions-table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Instrument</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Avg</TableCell>
                            <TableCell>LTP</TableCell>
                            <TableCell>P&L</TableCell>
                            <TableCell>Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {positions.map((position, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{position.instrument}</TableCell>
                                <TableCell>{position.quantity}</TableCell>
                                <TableCell>{position.average}</TableCell>
                                <TableCell>{position.ltp}</TableCell>
                                <TableCell>{position.pnl}</TableCell>
                                <TableCell>{position.change}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}


export default Positions;