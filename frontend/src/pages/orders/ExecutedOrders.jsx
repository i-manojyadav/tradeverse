import { useContext, useEffect, useState } from 'react';
import './ExecutedOrders.css';
import OrdersTable from './OrdersTable';
import { OrdersContext } from '../../context/OrdersContext';

function ExecutedOrders() {

    const { orders } = useContext(OrdersContext);
    const [ executedOrders, setExecutedOrders ] = useState([]);

    useEffect(() => {

        if (orders.length === 0) return;

        const exeOrders = orders.filter((order) => {
            return order.status === "EXECUTED";
        });

        setExecutedOrders(exeOrders);
        
    }, [orders]);

    return (
        <div>
            { executedOrders.length && <OrdersTable ordersData={executedOrders} /> }
        </div>
    )
}


export default ExecutedOrders;