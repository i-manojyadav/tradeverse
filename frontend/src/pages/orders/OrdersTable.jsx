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
                        <TableCell>Product</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>LTP</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ordersData.map((data, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{color: "white",}} >{data.time}</TableCell>
                            <TableCell>{data.type}</TableCell>
                            <TableCell>{data.instrument}</TableCell>
                            <TableCell>{data.product}</TableCell>
                            <TableCell>{data.quantity}</TableCell>
                            <TableCell>{data.ltp}</TableCell>
                            <TableCell>{data.price}</TableCell>
                            <TableCell>{data.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default OrdersTable;