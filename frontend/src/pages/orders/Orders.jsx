import ExecutedOrders from './ExecutedOrders';
import OpenOrders from './OpenOrders';
import './Orders.css';

function Orders() {
    return(
        <div className='orders'>
            <OpenOrders />
            <ExecutedOrders />
        </div>
    )
}


export default Orders;