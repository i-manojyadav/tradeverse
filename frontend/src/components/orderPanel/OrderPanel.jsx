import './OrderPanel.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CryptoAPIContext } from '../../context/CryptoAPIContext';
import { useEffect } from 'react';
import { OrdersContext } from '../../context/OrdersContext';
import { PositionsContext } from '../../context/PositionsContext';
import { HoldingsContext } from '../../context/HoldingsContext';


function OrderPanel() {

    const location = useLocation();
    const { symbol } = location.state || {};

    const { setOrders } = useContext(OrdersContext);
    const { coins } = useContext(CryptoAPIContext);
    const { enrichedPositions } = useContext(PositionsContext);
    const { enrichedHoldings } = useContext(HoldingsContext);

    const [ coin, setCoin ] = useState([]);
    const [ sellOrder, setSellOrder ] = useState([]);
    const [ orderData, setOrderData ] = useState({
        symbol: "",
        side: "",
        mode: "",
        quantity: "",
        entryPrice: "",
        leverage: "1",
    });


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

        if (orderData.mode === "INVEST") {
            orderData.leverage = "1";
        }

        try {
            const response = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                setOrders(data.orders);
                setOrderData({
                    symbol: "",
                    side: "",
                    mode: "",
                    quantity: "",
                    entryPrice: "",
                });
            } else {
                console.log("Something went wrong");
            }

        } catch(err) {
            console.log(err);
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
                    <TextField className='input' name='entryPrice' value={orderData.entryPrice} onChange={handleChange} type='number' required id="outlined-basic" label="Entry Price" variant="outlined" />
                </div>
                { orderData.mode === "TRADE" && <div className='order-leverage'>
                    <Slider name='leverage' onChange={handleChange} min={1} max={100} defaultValue={1} aria-label="Default" valueLabelDisplay="on" />
                </div> }
                <div className='order-info'>
                    <p>
                        <span>Margin Required: </span>
                        <span>{Number(((Number(orderData.quantity) * Number(orderData.entryPrice)) / Number(orderData.leverage)).toFixed(1)).toLocaleString() || 0}</span>
                    </p>

                    { orderData.mode === "TRADE" && <p>
                        <span>Liquidation Price: </span>
                        <span>
                            {orderData.side === "BUY" ? `${Number(Number(Number(orderData.entryPrice) * (1 - 1 / Number(orderData.leverage))).toFixed(1)).toLocaleString()}` :
                            orderData.side === "SELL" ? `${Number(Number(Number(orderData.entryPrice) * (1 + 1 / Number(orderData.leverage))).toFixed(1)).toLocaleString()}` : "0"}
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