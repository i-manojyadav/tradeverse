import MobileOrderItem from './MobileOrderItem';
import './OrdersTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";

function OrdersTable({ ordersData }) {

    const isMobile = window.innerWidth <= 768;
    const isDesktop = window.innerWidth > 768;


    return (
        <>
        {isDesktop && <TableContainer className='MUI-table'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Mode</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Side</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Lev.</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ordersData.map((order, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{color: "white",}} >{new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                            <TableCell>{order.symbol}</TableCell>
                            <TableCell>{order.mode}</TableCell>
                            <TableCell>{order.type.replace("_", " ")}</TableCell>
                            <TableCell>{order.side}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{Number(Number(order.price).toFixed(2)).toLocaleString()}</TableCell>
                            <TableCell>{order.leverage}X</TableCell>
                            <TableCell>{order.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>}
        
        {isMobile && <div>
            <MobileOrderItem orders={ordersData} />
        </div>}
        </>
    )
}

export default OrdersTable;