import './OrderPanel.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CryptoAPIContext } from '../../context/CryptoAPIContext';
import { useEffect } from 'react';
import { OrdersContext } from '../../context/OrdersContext';
import { PositionsContext } from '../../context/PositionsContext';
import { HoldingsContext } from '../../context/HoldingsContext';

const url = import.meta.env.VITE_API_URL;

function OrderPanel() {

    const location = useLocation();
    const { symbol } = location.state || {};

    const { setOrders } = useContext(OrdersContext);
    const { coins } = useContext(CryptoAPIContext);
    const { enrichedPositions } = useContext(PositionsContext);
    const { enrichedHoldings } = useContext(HoldingsContext);

    const [ coin, setCoin ] = useState([]);
    const [ orderAlert, setOrderAlert ] = useState(false);
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

        const liqPriceBuy = Number(orderData.price) * (1 - 1 / Number(orderData.leverage));
        const liqPriceSell = Number(orderData.price) * (1 + 1 / Number(orderData.leverage));

        if (activeTgt === true && orderData.side === "BUY") {
            if (Number(orderData.target < Number(orderData.price))) {
                setOrderAlert(true);
                return;
            }

        } else if (activeTgt === true && orderAlert.side === "SELL") {
            if (Number(orderData.target > Number(orderData.price))) {
                setOrderAlert(true);
                return;
            }
        }

        if (activeSL === true && orderData.side === "BUY") {
            if (Number(orderData.stopLoss) >= Number(orderData.price) || Number(orderData.stopLoss) <= liqPriceBuy) {
                setOrderAlert(true);
                return;
            }

        } else if (activeSL === true && orderData.side === "SELL") {
            if (Number(orderData.stopLoss) <= Number(orderData.price) || Number(orderData.stopLoss) >= liqPriceSell) {
                setOrderAlert(true);
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
                <AppAlert msg={data.message} severity={"success"} />
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
            } else {
                <AppAlert msg={data.message} severity={"error"} />
            }

        } catch(err) {
            <AppAlert msg={err} severity={"error"} />
        }
    }

    return (
        <div className='order-panel'>
            <form onSubmit={handleSubmit}>
                <div className='order-asset'>
                    <p className='order-asset-title'>{coin[0]?.symbol}</p>
                    <p className='order-asset-price'>{Number(Number(coin[0]?.lastPrice).toFixed(1)).toLocaleString()}</p>
                </div>
                <div className='order-type'>
                    <button type='button' onClick={() => { setOrderData({ ...orderData, mode: "TRADE" }) }} className={orderData.mode === "TRADE" ? "active-order-type" : ""}>Trade</button>
                    <button type='button' onClick={() => { setOrderData({ ...orderData, mode: "INVEST"}) }}className={orderData.mode === "INVEST" ? "active-order-type" : ""}>Invest</button>
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
                        <span>Target:</span>
                        <span><Switch checked={activeTgt} onChange={() => tgtToggle()} /></span>
                    </p>
                    {activeTgt && <div>
                        <TextField className='input' name='target' value={orderData.target} onChange={handleChange} type='number' required id='outlined-basic' label="Target" variant='outlined' />
                    </div>}
                </div>
                <div className='order-StopLoss' style={{ display: orderData.mode === "INVEST" ? "none" : "block"}}>
                    <p>
                        <span>Stop Loss:</span>
                        <span><Switch checked={activeSL} onChange={() => slToggle()} /></span>
                    </p>
                    {activeSL && <div>
                        <TextField className='input' name='stopLoss' value={orderData.stopLoss} onChange={handleChange} type='number' required id='outlined-basic' label="Stop Loss" variant='outlined' />
                    </div>}
                </div>
                <div className='order-alert' style={{ display: orderAlert ? "block" : "none"}}>
                    {orderData.target && <p>Target should be <b>{orderData.side === "BUY" ? "Above" : orderData.side === "SELL" ? "Below" : ""}</b> Entry Price</p>}
                    {orderData.stopLoss && <p>Stop Loss should be between <b>Entry & Liquidation Price</b></p>}
                </div>
                { orderData.mode === "TRADE" && <div className='order-leverage'>
                    <Slider name='leverage' onChange={handleChange} min={1} max={100} defaultValue={1} aria-label="Default" valueLabelDisplay="on" />
                </div> }
                <div className='order-info'>
                    <p>
                        <span>Margin Required: </span>
                        <span>{Number(((Number(orderData.quantity) * Number(orderData.price)) / Number(orderData.leverage)).toFixed(1)).toLocaleString() || 0}</span>
                    </p>

                    { orderData.mode === "TRADE" && <p>
                        <span>Liquidation Price: </span>
                        <span>
                            {orderData.side === "BUY" ? `${Number(Number(Number(orderData.price) * (1 - 1 / Number(orderData.leverage))).toFixed(1)).toLocaleString()}` :
                            orderData.side === "SELL" ? `${Number(Number(Number(orderData.price) * (1 + 1 / Number(orderData.leverage))).toFixed(1)).toLocaleString()}` : "0"}
                        </span>
                    </p> }
                </div>
                <div className='order-btn'>
                    <Button type='submit' style={{ display: (orderData.mode === "" || orderData.side === "")  ? "none" : ""}} variant="contained" color={orderData.side === "BUY" ? "success" : orderData.side === "SELL" ? "error" : "success"}>{`${orderData.side} ${coin[0]?.symbol}`}</Button>
                </div>
            </form>
        </div>
    )
}


export default OrderPanel;