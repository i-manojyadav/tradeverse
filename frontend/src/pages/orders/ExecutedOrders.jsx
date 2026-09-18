import { useContext, useEffect, useState } from 'react';
import './ExecutedOrders.css';
import OrdersTable from './OrdersTable';
import { OrdersContext } from '../../context/OrdersContext';
import EmptyState from '../../components/emptyStates/emptyState';

function ExecutedOrders() {

    const { orders } = useContext(OrdersContext);
    const [ executedOrders, setExecutedOrders ] = useState([]);

    useEffect(() => {

        if (!orders) return;

        const exeOrders = orders.filter((order) => {
            return order.status !== "PENDING";
        });

        setExecutedOrders(exeOrders);
        
    }, [orders]);

    return (
        <div>
            {executedOrders.length > 0 && <OrdersTable ordersData={executedOrders} />}
            {executedOrders.length === 0 && <EmptyState title={"No executed orders"} />}
        </div>
    )
}


export default ExecutedOrders;