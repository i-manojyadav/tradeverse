import { useContext, useEffect, useRef, useState } from 'react';
import './Watchlist.css';
import { Box, TextField } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { NavLink } from 'react-router-dom';
import { WatchlistContext } from '../../context/WatchlistContext';

import CryptoData from '../../services/cryptoAPI';
import { CryptoAPIContext } from '../../context/CryptoAPIContext';

function Watchlist() {

    const inputRef = useRef();

    const { watchlist, setWatchlist } = useContext(WatchlistContext);
    const { coins } = useContext(CryptoAPIContext);

    const [ filteredCoins, setFilteredCoins ] = useState([]);
    const [ watchlistTitle, setWatchlistTitle ] = useState({title: ""});
    const [ active, setActive ] = useState([]);
    const [ createActive, setCreateActive ] = useState(false);
    const [ searchActive, setSearchActive ] = useState(false);
    const [ currentWatchlist, setCurrentWatchlist ] = useState([]);
    const [ watchlistCoins, setWatchlistCoins ] = useState([]);


    /** Set Current Watchlist */
    useEffect(() => {
        if (watchlist.length > 0) {
            setCurrentWatchlist(watchlist[0]);
        }
    }, [watchlist]);

    /** Search Coins */
    function handleSearch(e) {
        const value = e.target.value.toLowerCase();

        if (value.length > 0) {
            setSearchActive(true);
        } else {
            setSearchActive(false);
        }

        let result = coins.filter((coin) => {
            return coin.symbol.toLowerCase().startsWith(value);
        });

        setFilteredCoins(result);
    }

    /** Handle Coin Add (Backend) */
    const handleAddCoin = async (symbol) => {
        const coinSymbol = symbol.toUpperCase();

        try {
        const response = await fetch(`http://localhost:3000/watchlist/${currentWatchlist._id}/add`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({coinSymbol}),
        });

        const data = await response.json();

        if (response.ok) {
            setWatchlist(data.watchlist);
            console.log(data.message);
            inputRef.current.value = "";
        } else {
            console.log("Something went wrong");
        }

        } catch(err) {
            console.log(err);
        }
    }

    /** Insert Live Coin's Price in Watchlist */
    useEffect(() => {

        if (currentWatchlist.length === 0) return;

        const curWatchlist = watchlist.filter((list) => {
            return list._id === currentWatchlist._id;
        });

        const coinPrice = curWatchlist[0].symbols.flatMap((symbol) => {
            return coins.filter((coin) => {
                return symbol === coin.symbol;
            });
        });

        setWatchlistCoins(coinPrice);

    }, [currentWatchlist, watchlist, coins]);

    /** Create Watchlist (Active) */
    function createWatchlist() {
        if (createActive === false) {
            setCreateActive(true);
        } else {
            setCreateActive(false);
        }
    }

    /** Handle Watchlist Create */
    function handleChange(e) {
        setWatchlistTitle({...watchlistTitle, [e.target.name]: e.target.value});
    }

    const handleCreateWatchlist = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch("http://localhost:3000/watchlist/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(watchlistTitle),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Watchlist Created");
            setWatchlistTitle({title: ""});
        } else {
            console.log(data.message);
        }

        } catch(err) {
            console.log(err);
        }
    }


    return (
        <div className='watchlist'>
            <div className='watchlist-search'>
                <TextField inputRef={inputRef} sx={{width: "100%"}} name='coin' onChange={handleSearch} id="outlined-basic" label="Search coins..." variant="outlined" />
            </div>

            <div className='coin-search' style={{ display: searchActive ? "block" : "none"}}>
                {filteredCoins.map((coin) => (
                    <p className='coin-item'><span>{coin.symbol}</span> <span onClick={() => { handleAddCoin(coin.symbol); setSearchActive(false) }}><AddBoxOutlinedIcon /></span></p>
                ))}
            </div>

            <div className='create-watchlist' style={{display: createActive ? "block" : "none"}}>
                <form onSubmit={handleCreateWatchlist}>
                <TextField required sx={{width: "100%"}} name='title' value={watchlistTitle.title} onChange={handleChange} id="outlined-basic" label="Watchlist title" variant="outlined" />
                <button>Create</button>
                </form>
            </div>

            <div className='watchlist-content'>
                <div className='watchlist-nav'>
                    {watchlist.map((list, idx) => (
                        <div className={currentWatchlist._id === list._id ? "current-watchlist" : "user-watchlist"} onClick={() => setCurrentWatchlist(list)} key={idx}><span>{list.title}</span></div>
                    ))}
                    <button onClick={() => createWatchlist()}>Add +</button>
                </div>

                <div className='watchlist-items'>
                    {watchlistCoins.map((coin) => (
                        <div>
                            <p style={{color: Number(coin.priceChange) > 0 ? "#059669" : "#FF0000"}}>{coin.symbol}</p>
                            <p className='watchlist-hover-items'><span><NavLink className='watchlist-items-chart' to='/chart' state={coin.symbol}><InsertChartIcon /></NavLink></span></p>
                            <p><span>{Number(Number(coin.lastPrice).toFixed(1)).toLocaleString()}</span> <span>{Number(Number(coin.priceChange).toFixed(1)).toLocaleString()}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Watchlist;