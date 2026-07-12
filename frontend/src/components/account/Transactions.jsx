import { useContext } from 'react';
import './Transactions.css';
import { AuthContext } from '../../context/AuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function Transactions() {

    const { user } = useContext(AuthContext);

    return (
        <div className='transactions'>
            <TableContainer className='MUI-table'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Side</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Avg. Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Cr/Dr</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user?.transactions.map((transaction) => (
                            <TableRow>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{transaction.symbol}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.side}</TableCell>
                                <TableCell>{transaction.quantity}</TableCell>
                                <TableCell>{transaction.averagePrice}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
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