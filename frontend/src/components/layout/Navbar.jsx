import './Navbar.css';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <p>Tradeverse</p>
            </div>
            <div className='navbar-right'>
                <NavLink to='/' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                <NavLink to='/orders' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Orders</NavLink>
                <NavLink to='/holdings' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Holdings</NavLink>
                <NavLink to='/positions' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Positions</NavLink>
                <NavLink to='account' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Account</NavLink>
            </div>
        </div>
    )
}


export default Navbar;