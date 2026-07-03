import './Navbar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <p>Tradeverse</p>
            </div>
            <div className='navbar-right'>
                <a>Dashboard</a>
                <a>Orders</a>
                <a>Holdings</a>
                <a>Positions</a>
                <a>Funds</a>
                <a><AccountCircleIcon fontSize='small' /> </a>
            </div>
        </div>
    )
}


export default Navbar;