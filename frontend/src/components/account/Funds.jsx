import { useContext } from 'react';
import './Funds.css';
import { AuthContext } from '../../context/AuthContext';

function Funds() {

    const { user } = useContext(AuthContext);

    return (
        <div className='funds'>
            <p>Available Funds</p>
            <p className='available-funds'>{Number(Number(user?.wallet?.funds).toFixed(1)).toLocaleString()}</p>
        </div>
    )
}


export default Funds;