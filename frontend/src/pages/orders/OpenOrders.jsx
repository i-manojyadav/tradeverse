import { useState } from 'react';
import './OpenOrders.css';
import OrdersTable from './OrdersTable';

function OpenOrders() {

    const [ openOrders, setOpenOrders ] = useState([
        {
            time: "15:23:26",
            type: "buy",
            instrument: "HDFC Bank",
            product: "CNC",
            quantity: "15",
            ltp: "800",
            price: "790",
            status: "open",
        },
        {
            time: "15:23:26",
            type: "buy",
            instrument: "HDFC Bank",
            product: "CNC",
            quantity: "15",
            ltp: "800",
            price: "790",
            status: "open",
        },
        {
            time: "15:23:26",
            type: "buy",
            instrument: "HDFC Bank",
            product: "CNC",
            quantity: "15",
            ltp: "800",
            price: "790",
            status: "open",
        },
        {
            time: "15:23:26",
            type: "buy",
            instrument: "HDFC Bank",
            product: "CNC",
            quantity: "15",
            ltp: "800",
            price: "790",
            status: "open",
        },
        {
            time: "15:23:26",
            type: "buy",
            instrument: "HDFC Bank",
            product: "CNC",
            quantity: "15",
            ltp: "800",
            price: "790",
            status: "open",
        },
    ]);

    return(
        <div className='openOrders'>
            <h3>Open Orders</h3>
            <OrdersTable ordersData={openOrders} />
        </div>
    )
}


export default OpenOrders;