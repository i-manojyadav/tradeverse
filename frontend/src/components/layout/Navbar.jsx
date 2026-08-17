import './Navbar.css';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { WalletContext } from '../../context/WalletContext';
import AppAlert from '../ui/AppAlert';

const url = import.meta.env.VITE_API_URL;

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
            const response = await fetch(`${url}/signout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                <AppAlert msg={data.message} severity={"success"} />

            } else {
                <AppAlert msg={data.message} severity={"error"} />
            }
            
        } catch(err) {
            <AppAlert msg={err} severity={"error"} />
        }
    }

    return (
        <>
        <div className='navbar'>
            <div className='navbar-left'>
                <p>Tradeverse</p>
            </div>
            <div className='navbar-right'>
                <NavLink to='/' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><i class="fa-solid fa-gauge-high"></i> <span>Dashboard</span></NavLink>
                <span className='wList'><NavLink to='/watchlist' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><i class="fa-solid fa-bookmark"></i> <span>Watchlist</span></NavLink></span>
                <NavLink to='/chart' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><i class="fa-solid fa-chart-line"></i> <span>Chart</span></NavLink>
                <NavLink to='/orders' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><i class="fa-solid fa-list-check"></i> <span>Orders</span></NavLink>
                <NavLink to='/portfolio' className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><i class="fa-solid fa-suitcase"></i> <span>Portfolio</span></NavLink>
                <div>
                    <NavLink onClick={handlePopup} className='sub-nav-link' ><i class="fa-solid fa-circle-user"></i> <span>Account</span></NavLink>
                    <div style={{ display: isActive ? "inline-block" : "none"}} >
                        <div className='ac-popup'>
                            <NavLink onClick={handlePopup} to='/account' className='sub-nav-link'>Account</NavLink>
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