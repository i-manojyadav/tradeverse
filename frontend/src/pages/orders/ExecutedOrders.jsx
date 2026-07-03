import { useState } from 'react';
import './ExecutedOrders.css';
import OrdersTable from './OrdersTable';

function ExecutedOrders() {

    const [ executedOrders, setExecutedOrders ] = useState([
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

    return (
        <div>
            <h3>Executed Orders</h3>
            { executedOrders.length && <OrdersTable ordersData={executedOrders} /> }
        </div>
    )
}


export default ExecutedOrders;