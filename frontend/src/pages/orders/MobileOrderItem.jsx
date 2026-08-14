import { useState } from 'react';
import './MobileOrderItem.css';

function MobileOrderItem({ orders }) {

    const [ isActive, setIsActive ] = useState(false);
    const [ curOrder, setCurOrder ] = useState([]);

    function handlePopup(order) {
        if (isActive) {
            setIsActive(false);
            return;
        }
        if (!order) return;
        setCurOrder(order);
        setIsActive(true);
    }



    return (
        <div>
            <div className='mobile-order-items'>
                {orders.map((order, idx) => (
                    <div className='mti' key={idx} onClick={() => handlePopup(order)}>
                        <div className='mti-left'>
                            <p>
                                <span className='mti-symbol'>{order.symbol}</span> <span className='mti-side' style={{ color: order.side === "BUY" ? "#008000" : "#ff0000"}}>{order.side}</span>
                            </p>
                            <p>
                                <span>
                                    <span className='mti-title'>Price.</span> <span className='mti-value'>{Number(order.price).toLocaleString()}</span>
                                </span>
                                ·
                                <span>
                                    <span className='mti-title'>Qty.</span> <span className='mti-value'>{Number(order.quantity).toLocaleString()}</span>
                                </span>
                            </p>
                        </div>
                        <div className='mti-right'>
                            <p className='mti-type'>
                                <span className='mti-type'>{order.type.replace("_", " ")}</span>
                            </p>
                            <p>
                                <span className={order.status === "PENDING" ? "mti-status-pending" : "mti-status-executed"}>{order.status}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {isActive && <div className='order-overview'>
                <div className='overview-top'>
                    <p>
                        <span className='overview-symbol'>{curOrder.symbol}</span>
                        <span style={{fontSize: "13px", color: "#ffffff"}}><span style={{ color: curOrder.side === "BUY" ? "#008000" : "#ff0000"}}>{curOrder.side}</span> · <span>{curOrder.type.replace("_", " ")}</span> · <span>{Number(Number(curOrder.price).toFixed(2)).toLocaleString()}</span></span>
                    </p>
                    <p style={{ color: "red"}}>
                        <i onClick={() => handlePopup()} className="fa-solid fa-xmark"></i>
                    </p>
                </div>
                <div className='overview-data'>
                    <p>
                        <span className='overview-title'>Time</span>
                        <span className='overview-value'>{new Date(curOrder.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p>
                        <span className='overview-title'>Mode</span>
                        <span className='overview-value'>{curOrder.mode}</span>
                    </p>
                    {curOrder.leverage && <p>
                        <span className='overview-title'>Leverage</span>
                        <span className='overview-value'>{curOrder.leverage}x</span>
                    </p>}
                    {curOrder.liquidationPrice && <p>
                        <span className='overview-title'>LiquidationPrice</span>
                        <span className='overview-value'>{Number(Number(curOrder.liquidationPrice).toFixed(2)).toLocaleString()}</span>
                    </p>}
                </div>
            </div>}
        </div>
    )
}


export default MobileOrderItem;