import './Navbar.css';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { WalletContext } from '../../context/WalletContext';

function Navbar() {

    const { user } = useContext(AuthContext);
    const { wallet } = useContext(WalletContext);
    
    const [ isActive, setIsActive ] = useState(false);

    function handlePopup() {
        if (isActive === false) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }

    /** Handle User Sign Out */

    async function handleSignOut() {
        try {
            const response = await fetch("http://localhost:3000/signout", {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
            } else {
                console.log("Sign Out Failed");
            }
        } catch(err) {
            console.log("Server side error", err);
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
                            <p><span>Funds:</span> <span>{wallet[0]?.funds}</span></p>
                            <NavLink onClick={handlePopup} to='/signin' className='sub-nav-link'>Sign In</NavLink>
                            <NavLink onClick={handlePopup} to='/signup' className='sub-nav-link'>Sign Up</NavLink>
                            <NavLink onClick={handleSignOut} className='sub-nav-link'>Sign Out</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


export default Navbar;