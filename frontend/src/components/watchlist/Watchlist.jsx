import { useState } from 'react';
import './Watchlist.css';
import { Box, TextField } from '@mui/material';

function Watchlist() {

    const [ watchlist, setWatchList ] = useState([
        {
            title: "Intraday",
            assets: [
                {
                    name: "Bitcoin",
                    symbol: "BTCUSDT",
                    ltp: "61000",
                    change: "388",
                },
                {
                    name: "Ethereum",
                    symbol: "ETHUSDT",
                    ltp: "1700",
                    change: "50",
                },
            ]
        },
        {
            title: "Swing",
            assets: [
                {
                    name: "Bitcoin",
                    symbol: "BTCUSDT",
                    ltp: "61000",
                    change: "388",
                },
                {
                    name: "Ethereum",
                    symbol: "ETHUSDT",
                    ltp: "1700",
                    change: "50",
                },
            ]
        },
        {
            title: "BTST",
            assets: [
                {
                    name: "Bitcoin",
                    symbol: "BTCUSDT",
                    ltp: "61000",
                    change: "388",
                },
                {
                    name: "Ethereum",
                    symbol: "ETHUSDT",
                    ltp: "1700",
                    change: "50",
                },
            ]
        }
    ]);

    return(
        <div>
            <div className='watchlist-search'>
                <TextField sx={{backgroundColor: "#ffffff", width: "90%"}} id="outlined-basic" label="Search coins..." variant="outlined" />
            </div>
        </div>
    )
}


export default Watchlist;