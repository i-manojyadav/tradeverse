import { useState } from 'react';
import './Account.css';
import Profile from '../../components/account/Profile';
import Funds from '../../components/account/Funds';
import Transactions from '../../components/account/Transactions';

function Account() {

    const [ activeTab, setActiveTab ] = useState("profile");

    return (
        <div className='account'>
            <h2>Account</h2>
            <div className='tabs'>
                <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active-tab-btn" : ""}>Profile</button>
                <button onClick={() => setActiveTab("funds")} className={activeTab === "funds" ? "active-tab-btn" : ""}>Funds</button>
                <button onClick={() => setActiveTab("transactions")} className={activeTab === "transactions" ? "active-tab-btn" : ""}>Transactions</button>
            </div>
            <div className='account-content'>
                { activeTab === "profile" && <Profile /> }
                { activeTab === "funds" && <Funds /> }
                { activeTab === "transactions" && <Transactions /> }
            </div>
        </div>
    )
}


export default Account;