import './OrdersTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function OrdersTable({ ordersData }) {
    return (
        <TableContainer className='MUI-table'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Side</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Instrument</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ordersData.map((order, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{color: "white",}} >{new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                            <TableCell>{order.side}</TableCell>
                            <TableCell>{order.type}</TableCell>
                            <TableCell>{order.symbol}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
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