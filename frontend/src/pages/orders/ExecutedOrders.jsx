import { useContext, useEffect, useState } from 'react';
import './ExecutedOrders.css';
import OrdersTable from './OrdersTable';
import { OrdersContext } from '../../context/OrdersContext';
import NoTradingActivity from '../../components/emptyStates/NoTradingActivity';

function ExecutedOrders() {

    const { orders } = useContext(OrdersContext);
    const [ executedOrders, setExecutedOrders ] = useState([]);

    useEffect(() => {

        if (!orders) return;

        const exeOrders = orders.filter((order) => {
            return order.status === "EXECUTED";
        });

        setExecutedOrders(exeOrders);
        
    }, [orders]);

    return (
        <div>
            {executedOrders.length > 0 && <OrdersTable ordersData={executedOrders} />}
            {executedOrders.length === 0 && <NoTradingActivity />}
        </div>
    )
}


export default ExecutedOrders;