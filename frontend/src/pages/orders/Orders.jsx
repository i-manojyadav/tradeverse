import { useState } from 'react';
import PendingOrders from './PendingOrders';
import ExecutedOrders from './ExecutedOrders';
import './Orders.css';

function Orders() {

    const [ activeTab, setActiveTab ] = useState("pending");

    return (
        <div className='orders'>
            <div className='tabs'>
                <button onClick={() => setActiveTab("pending")} className={activeTab === "pending" ? "active-tab-btn" : ""}>Pending</button>
                <button onClick={() => setActiveTab("executed")} className={activeTab === "executed" ? "active-tab-btn" : ""}>Executed</button>
            </div>
            <div>
                { activeTab === "pending" && <PendingOrders />}
                { activeTab === "executed" && <ExecutedOrders />}
            </div>
        </div>
    )
}


export default Orders;