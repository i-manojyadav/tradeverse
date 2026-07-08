import { useContext, useEffect, useState } from 'react';
import './PendingOrders.css'
import { OrdersContext } from '../../context/OrdersContext';
import OrdersTable from './OrdersTable';

function PendingOrders() {

    const { orders } = useContext(OrdersContext);
    const [ pendingOrders, setPendingOrders ] = useState([]);

    useEffect(() => {
        
        if (!orders) return;

        const penOrders = orders.filter((order) => {
            return order.status === "PENDING"
        });

        setPendingOrders(penOrders);
    }, [orders]);


    return (
        <div className='pending-orders'>
            <h2>Pending Orders</h2>
            { pendingOrders.length && <OrdersTable ordersData={pendingOrders} /> }
        </div>
    )
}


export default PendingOrders;