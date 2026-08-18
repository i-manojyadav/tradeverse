import { useContext, useState } from 'react';
import './Portfolio.css';
import Holdings from './holdings/Holdings';
import Positions from './positions/Positions';
import { AuthContext } from '../../context/AuthContext';
import SignInPrompt from '../../components/emptyStates/SignInPrompt';


function Portfolio() {

    const { user } = useContext(AuthContext);

    const [ activeTab, setActiveTab ] = useState("holdings");

    return (
        <>
        {user && <div className='portfolio'>
            <div className='tabs'>
                <button onClick={() => setActiveTab("holdings")} className={activeTab === "holdings" ? "active-tab-btn" : ""}>Holdings</button>
                <button onClick={() => setActiveTab("positions")} className={activeTab === "positions" ? "active-tab-btn" : ""}>Positions</button>
            </div>
            <div>
                { activeTab === "holdings" && <Holdings /> }
                { activeTab === "positions" && <Positions /> }
            </div>
        </div>}
        {!user && <SignInPrompt />}
        </>
    )
}


export default Portfolio;