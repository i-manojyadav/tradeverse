import './Navbar.css';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {

    return (
        <div className='navbar'>
            <div>
                <p>Tradeverse</p>
            </div>
            <div>
                <NavLink to='/'>Dashboard</NavLink>
                <NavLink to='/orders'>Orders</NavLink>
                <NavLink to='/holdings'>Holdings</NavLink>
                <NavLink to='/positions'>Positions</NavLink>
            </div>
        </div>
    )
}


export default Navbar;