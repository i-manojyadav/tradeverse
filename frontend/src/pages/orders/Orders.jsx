import { useContext, useState } from 'react';
import PendingOrders from './PendingOrders';
import ExecutedOrders from './ExecutedOrders';
import './Orders.css';
import { AuthContext } from '../../context/AuthContext';
import SignInPrompt from '../../components/emptyStates/SignInPrompt';

function Orders() {

    const { user } = useContext(AuthContext);

    const [ activeTab, setActiveTab ] = useState("pending");

    return (
        <>
        {user && <div className='orders'>
            <div className='tabs'>
                <button onClick={() => setActiveTab("pending")} className={activeTab === "pending" ? "active-tab-btn" : ""}>Pending</button>
                <button onClick={() => setActiveTab("executed")} className={activeTab === "executed" ? "active-tab-btn" : ""}>Executed</button>
            </div>
            <div>
                { activeTab === "pending" && <PendingOrders />}
                { activeTab === "executed" && <ExecutedOrders />}
            </div>
        </div>}
        {!user && <SignInPrompt />}
        </>
    )
}


export default Orders;