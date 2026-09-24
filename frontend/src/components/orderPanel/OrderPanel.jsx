import './OrderPanel.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CryptoAPIContext } from '../../context/CryptoAPIContext';
import { useEffect } from 'react';
import { OrdersContext } from '../../context/OrdersContext';
import AppAlert from '../ui/AppAlert';
import { AuthContext } from '../../context/AuthContext';
import SignInPrompt from '../emptyStates/SignInPrompt';

const url = import.meta.env.VITE_API_URL;

function OrderPanel() {

    const location = useLocation();
    const navigate = useNavigate()
    const { symbol } = location.state || {};

    const [ alert, setAlert ] = useState(null);

    const { user } = useContext(AuthContext);
    const { setOrders } = useContext(OrdersContext);
    const { coins } = useContext(CryptoAPIContext);

    const [ coin, setCoin ] = useState([]);
    const [ orderData, setOrderData ] = useState({
        symbol: "",
        side: "",
        mode: "",
        quantity: "",
        price: "",
        target: "",
        stopLoss: "",
        leverage: "1",
    });
    const [ activeTgt, setActiveTGT] = useState(false);
    const [ activeSL, setActiveSL ] = useState(false);

    /** TARGET Toggle */
    function tgtToggle() {
        if (activeTgt === false) {
            setActiveTGT(true);
        } else {
            setActiveTGT(false);
            orderData.target = "";
        }
    }

    /** SL Toggle */
    function slToggle() {
        if (activeSL === false) {
            setActiveSL(true);
        } else {
            setActiveSL(false);
            orderData.stopLoss = "";
        }
    }


    /** Fetch Live Price */
    useEffect(() => {
        const orderCoin = coins.filter((coin) => {
            return coin.symbol === symbol;
        });

        setCoin(orderCoin);

    }, [coins, symbol]);

    function handleChange(e) {
        setOrderData({...orderData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        orderData.symbol = coin[0]?.symbol;
        if (!orderData.symbol) return;
        if (!orderData.mode) return;
        if (!orderData.side) return;

        const liqPriceBuy = Number(orderData.price) * (1 - 1 / Number(orderData.leverage));
        const liqPriceSell = Number(orderData.price) * (1 + 1 / Number(orderData.leverage));

        const side = orderData?.side;
        const orderPrice = Number(orderData.price);
        const targetPrice = Number(orderData.target);
        const stopLossPrice = Number(orderData.stopLoss);


        // Check margin availability
        const orderMode = orderData?.mode;
        const quantity = Number(orderData.quantity);
        const leverage = Number(orderData.leverage);
        const availableFunds = Number(user?.wallet?.funds);
        const margin = orderMode === "TRADE" ? (quantity * orderPrice) / leverage : quantity * orderPrice;

        if (margin > availableFunds) {
            setAlert({
                msg: "Insufficient funds",
                severity: "error",
            });
            return;
        }

        // Target alert
        if (activeTgt) {
            const msg = `Target price should be ${side === "BUY" ? "above" : "below"} entry price`;
            const priceCondition = side === "BUY" ? targetPrice < orderPrice : targetPrice > orderPrice;

            if(priceCondition) {
                setAlert({ msg: msg, severity: "error" });
                return;
            }
        }

        // Stop Loss alert
        if (activeSL) {
            const msg = "Stop Loss price should be between entry and liquidation price";
            const priceCondition = side === "BUY" ? (stopLossPrice >= orderPrice) || (stopLossPrice <= liqPriceBuy) : (stopLossPrice <= orderPrice) || stopLossPrice >= liqPriceSell;

            if (priceCondition) {
                setAlert({ msg: msg, severity: "error" });
                return;
            }
        }

        if (orderData.mode === "INVEST") {
            orderData.leverage = "1";
        }

        try {
            const response = await fetch(`${url}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({
                    msg: data.message,
                    severity: "success"
                });
                setOrders(data.orders);
                setOrderData({
                    symbol: "",
                    side: "",
                    mode: "",
                    quantity: "",
                    price: "",
                    target: "",
                    stopLoss: "",
                });
                navigate("/orders");
            } else {
                setAlert({
                    msg: data.message,
                    severity: "error"
                });
            }

        } catch(err) {
            setAlert({
                msg: err,
                severity: "error"
            });
        }
    }

    return (
        <>
        {user && <div className='order-panel'>
            { alert && <AppAlert msg={alert.msg} severity={alert.severity} /> }
            <form onSubmit={handleSubmit}>
                <div className='order-asset'>
                    <div className='order-symbol'>
                        <p className='order-symbol-title'>{coin[0]?.symbol}</p>
                        <p className='order-symbol-price'>{Number(Number(coin[0]?.lastPrice).toFixed(3)).toLocaleString()}</p>
                    </div>

                    <div className='order-mode'>
                        <button type='button' onClick={() => { setOrderData({ ...orderData, mode: "TRADE" }) }} className={orderData.mode === "TRADE" ? "order-mode-active" : ""}>Trade</button>
                        <button type='button' onClick={() => { setOrderData({ ...orderData, mode: "INVEST"}) }}className={orderData.mode === "INVEST" ? "order-mode-active" : ""}>Invest</button>
                    </div>
                </div>

                <div className='trade-side'>
                    <button type='button' onClick={() => setOrderData({ ...orderData, side: "BUY"})} className={orderData.side === "BUY" ? "trade-buy-btn" : ""}>Buy</button>
                    <button type='button' onClick={() => setOrderData({ ...orderData, side: "SELL"})} className={orderData.side === "SELL" ? "trade-sell-btn" : ""}>Sell</button>
                </div>

                <div className='order-value'>
                    <TextField className='input' name='quantity' value={orderData.quantity} onChange={handleChange} type='number' required id="outlined-basic" label="Quantity" variant="outlined" />
                    <TextField className='input' name='price' value={orderData.price} onChange={handleChange} type='number' required id="outlined-basic" label="Price" variant="outlined" />
                </div>

                <div className='order-target' style={{ display: orderData.mode === "INVEST" ? "none" : "block"}}>
                    <p>
                        <span>Target</span>
                        <span><Switch checked={activeTgt} onChange={() => tgtToggle()} /></span>
                    </p>

                    {activeTgt && <div>
                        <TextField className='input' name='target' value={orderData.target} onChange={handleChange} type='number' required id='outlined-basic' label="Target" variant='outlined' />
                    </div>}
                </div>

                <div className='order-StopLoss' style={{ display: orderData.mode === "INVEST" ? "none" : "block"}}>
                    <p>
                        <span>Stop Loss</span>
                        <span><Switch checked={activeSL} onChange={() => slToggle()} /></span>
                    </p>

                    {activeSL && <div>
                        <TextField className='input' name='stopLoss' value={orderData.stopLoss} onChange={handleChange} type='number' required id='outlined-basic' label="Stop Loss" variant='outlined' />
                    </div>}
                </div>

                {orderData.mode === "TRADE" && <div className='order-leverage'>
                    <Slider className='leverage-slider' name='leverage' onChange={handleChange} min={1} max={100} defaultValue={1} aria-label="Default" valueLabelDisplay="on" />
                </div>}

                {orderData.mode && orderData.side && <div className='order-btn'>
                    <Button type='submit' variant="contained" color={orderData.side === "BUY" ? "success" : orderData.side === "SELL" ? "error" : "success"}>{`${orderData.side} ${coin[0]?.symbol}`}</Button>
                </div>}

                <div className='order-info'>
                    <p>
                        <span>Margin: </span>
                        {orderData.mode === "TRADE" && <span>{Number(((Number(orderData.quantity) * Number(orderData.price)) / Number(orderData.leverage)).toFixed(1)).toLocaleString() || 0}</span>}
                        {orderData.mode === "INVEST" && <span>{Number((Number(orderData.quantity) * Number(orderData.price)).toFixed(1)).toLocaleString() || 0}</span>}
                    </p>

                    <p>
                        <span>Avail. </span>
                        <span>{Number(Number(user?.wallet?.funds).toFixed(1)).toLocaleString()}</span>
                    </p>

                    {orderData.mode === "TRADE" && <p>
                        <span>Liq. Price: </span>
                        <span>
                            {orderData.side === "BUY" ? `${Number(Number(Number(orderData.price) * (1 - 1 / Number(orderData.leverage))).toFixed(1)).toLocaleString()}` :
                            orderData.side === "SELL" ? `${Number(Number(Number(orderData.price) * (1 + 1 / Number(orderData.leverage))).toFixed(1)).toLocaleString()}` : "0"}
                        </span>
                    </p>}
                </div>
            </form>
        </div>}
        {!user && <SignInPrompt /> }
        </>
    )
}


export default OrderPanel;