import { useContext } from 'react';
import Watchlist from '../watchlist/Watchlist';
import './Sidebar.css';
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {

    const { user } = useContext(AuthContext);

    return(
        <div className='sidebar'>
            {user && <Watchlist />}
        </div>
    )
}


export default Sidebar;