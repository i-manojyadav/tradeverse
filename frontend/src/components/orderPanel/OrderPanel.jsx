import './OrderPanel.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CryptoAPIContext } from '../../context/CryptoAPIContext';
import { useEffect } from 'react';
import { OrdersContext } from '../../context/OrdersContext';


function OrderPanel() {

    const location = useLocation();
    const { symbol } = location.state || {};

    const { setOrders } = useContext(OrdersContext);
    const { coins } = useContext(CryptoAPIContext);
    const [ coin, setCoin ] = useState([]);

    const [ orderData, setOrderData ] = useState({
        symbol: "",
        side: "",
        type: "",
        quantity: "",
        price: "",
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
                    type: "",
                    quantity: "",
                    price: "",
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
                <div className='order-asset' style={{ backgroundColor: orderData.side === "BUY" ? "#16a34a" : orderData.side === "SELL" ? "#dc2626" : ""}}>
                    <p className='order-asset-title'>{coin[0]?.symbol}</p>
                    <p className='order-asset-price'>{Number(Number(coin[0]?.lastPrice).toFixed(1)).toLocaleString()}</p>
                </div>
                <div className='order-type'>
                    <FormControl error={!orderData.side} required>
                        <FormLabel sx={{ color: "#ffffff"}}>Side</FormLabel>
                        <RadioGroup name="side" value={orderData.side} onChange={handleChange} row>
                        <FormControlLabel value="BUY" control={<Radio />} label="Buy" />
                        <FormControlLabel value="SELL" control={<Radio />} label="Sell" />
                        </RadioGroup>
                        {!orderData.side && <FormHelperText>Please select Buy or Sell</FormHelperText>}
                    </FormControl>

                    <FormControl error={!orderData.type} required>
                        <FormLabel sx={{ color: "#ffffff"}}>Type</FormLabel>
                        <RadioGroup name="type" value={orderData.type} onChange={handleChange} row>
                        <FormControlLabel value="INTRADAY" control={<Radio />} label="Intraday" />
                        <FormControlLabel value="LONGTERM" control={<Radio />} label="Longterm" />
                        </RadioGroup>
                        {!orderData.type && <FormHelperText>Please select Intraday or Longterm</FormHelperText>}
                    </FormControl>
                </div>
                <div className='order-value'>
                    <TextField name='quantity' value={orderData.quantity} onChange={handleChange} type='number' required id="outlined-basic" label="Quantity" variant="outlined" />
                    <TextField name='price' value={orderData.price} onChange={handleChange} type='number' required id="outlined-basic" label="Price" variant="outlined" />
                </div>
                <div className='order-btn'>
                    <Button type='submit' variant="contained" color="success">Place Order</Button>
                </div>
            </form>
        </div>
    )
}


export default OrderPanel;