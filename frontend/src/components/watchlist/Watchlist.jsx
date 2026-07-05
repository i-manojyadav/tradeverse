import { useEffect, useState } from 'react';
import './Watchlist.css';
import { Box, TextField } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { NavLink } from 'react-router-dom';


function Watchlist() {

    const [ watchlist, setWatchList ] = useState([
        {
            title: "Intraday",
            coins: [
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
            coins: [
                {
                    name: "2",
                    symbol: "BTCUSDT",
                    ltp: "6100000",
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
            coins: [
                {
                    name: "3",
                    symbol: "BTCUSDT",
                    ltp: "61000",
                    change: "388",
                },
                {
                    name: "Ethereum",
                    symbol: "ETHUSDT",
                    ltp: "1700",
                    change: "-50",
                },
            ]
        },
    ]);

    const [ active, setActive ] = useState([]);
    const [ watchlistItems, setWatchlistItems ] = useState(watchlist[0].coins);

    useEffect(() => {

        if (active.length === 0 ) return;

        let activeWatchlist = watchlist.filter((list) => {
            return active === list.title;
        });

        setWatchlistItems(activeWatchlist[0].coins);

    }, [active]);

    return (
        <div className='watchlist'>
            <div className='watchlist-search'>
                <TextField sx={{width: "100%"}} id="outlined-basic" label="Search coins..." variant="outlined" />
            </div>
            <div className='watchlist-content'>
                <div className='watchlist-nav'>
                    {watchlist.map((list, idx) => (
                        <div className='user-watchlist' onClick={() => setActive(list.title)} key={idx}><p>{list.title}</p></div>
                    ))}
                </div>

                <div className='watchlist-items'>
                    {watchlistItems.map((coin) => (
                        <div>
                            <p style={{color: Number(coin.change) > 0 ? "#059669" : "#FF0000"}}>{coin.symbol}</p>
                            <p className='watchlist-hover-items'><span><NavLink className='watchlist-items-chart' to='/chart' state={coin.symbol}><InsertChartIcon /></NavLink></span></p>
                            <p><span>{Number(Number(coin.ltp).toFixed(1)).toLocaleString()}</span> <span>{Number(Number(coin.change).toFixed(1)).toLocaleString()}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Watchlist;