import './OrdersTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function OrdersTable({ ordersData }) {
    return (
        <TableContainer>
            <Table className='orders-table'>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Instrument</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>LTP</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ordersData.map((order, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{color: "white",}} >{new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                            <TableCell>{order.side}</TableCell>
                            <TableCell>{order.symbol}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.ltp}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default OrdersTable;