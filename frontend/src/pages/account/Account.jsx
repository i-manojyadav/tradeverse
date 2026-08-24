import { useState } from 'react';
import './Account.css';
import Profile from '../../components/account/Profile';
import Funds from '../../components/account/Funds';
import ProfitLoss from '../../components/account/ProfitLoss';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SignInPrompt from '../../components/emptyStates/SignInPrompt';

function Account() {

    const { user } = useContext(AuthContext);

    const [ activeTab, setActiveTab ] = useState("profile");

    return (
        <>
        {user && <div className='account'>
            <h2>Account</h2>
            <div className='account-user'>
                <div>
                    <i className="fa-regular fa-user"></i>
                </div>
                <div>
                    <p>{user?.user?.name}</p>
                    <p>@{user?.user?.username}</p>
                </div>
            </div>
            <div className='tabs'>
                <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active-tab-btn" : ""}>Profile</button>
                <button onClick={() => setActiveTab("funds")} className={activeTab === "funds" ? "active-tab-btn" : ""}>Funds</button>
                <button onClick={() => setActiveTab("profitLoss")} className={activeTab === "profitLoss" ? "active-tab-btn" : ""}>Profit & Loss</button>
            </div>
            <div className='account-content'>
                { activeTab === "profile" && <Profile /> }
                { activeTab === "funds" && <Funds /> }
                { activeTab === "profitLoss" && <ProfitLoss /> }
            </div>
        </div>}
        { !user && <SignInPrompt /> }
        </>
    )
}


export default Account;