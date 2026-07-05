import './Navbar.css';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

function Navbar() {

    const [ isActive, setIsActive ] = useState(false);

    function handlePopup() {
        if (isActive === false) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }

    return (
        <>
        <div className='navbar'>
            <div className='navbar-left'>
                <p>Tradeverse</p>
            </div>
            <div className='navbar-right'>
                <NavLink to='/' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                <NavLink to='/orders' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Orders</NavLink>
                <NavLink to='/holdings' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Holdings</NavLink>
                <NavLink to='/positions' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Positions</NavLink>
                <div>
                    <NavLink onClick={handlePopup} className='acc-popup sub-nav-link' >Account</NavLink>
                    <div style={{ display: isActive ? "inline-block" : "none"}} >
                        <div className='ac-popup'>
                            <NavLink onClick={handlePopup} to='/signin' className='sub-nav-link'>Sign In</NavLink>
                            <NavLink onClick={handlePopup} to='/signup' className='sub-nav-link'>Sign Up</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


export default Navbar;