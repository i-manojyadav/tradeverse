import { useContext } from 'react';
import './Transactions.css';
import { AuthContext } from '../../context/AuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function Transactions({ transactions }) {

    return (
        <div className='transactions'>
            <TableContainer className='MUI-table'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Side</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Cr/Dr</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{transaction.symbol}</TableCell>
                                <TableCell>{`${transaction.mode} (${transaction.leverage}X)`}</TableCell>
                                <TableCell>{transaction?.type?.replace("_", " ")}</TableCell>
                                <TableCell>{transaction.side}</TableCell>
                                <TableCell>{Number(transaction.quantity).toLocaleString()}</TableCell>
                                <TableCell>{Number(transaction.averagePrice).toLocaleString()}</TableCell>
                                <TableCell>{Number(transaction.amount).toLocaleString()}</TableCell>
                                <TableCell>{transaction.walletEffect}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}


export default Transactions;