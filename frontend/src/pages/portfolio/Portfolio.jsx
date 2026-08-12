import { useState } from 'react';
import './Portfolio.css';
import Holdings from './holdings/Holdings';
import Positions from './positions/Positions';


function Portfolio() {

    const [ activeTab, setActiveTab ] = useState("holdings");

    return (
        <div className='portfolio'>
            <div className='tabs'>
                <button onClick={() => setActiveTab("holdings")} className={activeTab === "holdings" ? "active-tab-btn" : ""}>Holdings</button>
                <button onClick={() => setActiveTab("positions")} className={activeTab === "positions" ? "active-tab-btn" : ""}>Positions</button>
            </div>
            <div>
                { activeTab === "holdings" && <Holdings /> }
                { activeTab === "positions" && <Positions /> }
            </div>
        </div>
    )
}


export default Portfolio;