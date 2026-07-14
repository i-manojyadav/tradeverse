import { useContext, useEffect, useRef, useState } from 'react';
import './Watchlist.css';
import { Box, TextField } from '@mui/material';
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

    const [ createActive, setCreateActive ] = useState(false);
    const [ searchActive, setSearchActive ] = useState(false);
    const [ searchSecActive, setSearchSecActive ] = useState(false);

    const [ activeWatchlist, setActiveWatchlist ] = useState([]);
    const [ watchlistCoins, setWatchlistCoins ] = useState([]);


    /** Search Section Toggle */
    function searchSecToggle() {
        if (searchSecActive === false) {
            setSearchSecActive(true);
        } else {
            setSearchSecActive(false);
        }
    }

    /** Set Current Watchlist */
    useEffect(() => {
        if (watchlist?.length > 0) {
            setActiveWatchlist(watchlist[0]);
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
    const handleCoinAdd = async (symbol) => {
        const coinSymbol = symbol.toUpperCase();

        try {
        const response = await fetch(`http://localhost:3000/watchlist/${activeWatchlist._id}/add`, {

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
            searchSecToggle();
            inputRef.current.value = "";
        } else {
            console.log("Something went wrong");
            console.log(data.message);
        }

        } catch(err) {
            console.log(err);
        }
    }

    /** Insert Live Coin's Price in Watchlist */
    useEffect(() => {

        if (activeWatchlist.length === 0) return;

        const listCoins = activeWatchlist.coins.flatMap((coin) => {
            return coins.filter((c) => {
                return coin.symbol === c.symbol;
            });
        });

        setWatchlistCoins(listCoins);

    }, [ activeWatchlist, watchlist, coins]);

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
            setWatchlist(data.watchlist);
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
            <div className='watchlist-search' style={{ display: searchSecActive ? "block" : "none"}}>
                <TextField className='input' type='search' inputRef={inputRef} name='coin' onChange={handleSearch} id="outlined-basic" label="Search coins..." variant="outlined" />
            </div>

            <div className='coin-search' style={{ display: searchActive ? "block" : "none"}}>
                {filteredCoins.map((coin) => (
                    <p className='coin-item'><span>{coin.symbol}</span> <span onClick={() => { handleCoinAdd(coin.symbol); setSearchActive(false) }}><i className="fa-solid fa-plus"></i></span></p>
                ))}
            </div>

            <div className='create-watchlist' style={{display: createActive ? "block" : "none"}}>
                <form onSubmit={handleCreateWatchlist}>
                <TextField className='input' required name='title' value={watchlistTitle.title} onChange={handleChange} id="outlined-basic" label="Watchlist title" variant="outlined" />
                <button><i className="fa-solid fa-plus"></i> Create</button>
                </form>
            </div>

            <div className='watchlist-content'>
                <div className='watchlist-nav'>
                    {watchlist?.map((list, idx) => (
                        <div className={activeWatchlist._id === list._id ? "current-watchlist" : "user-watchlist"} onClick={() => setActiveWatchlist(list)} key={idx}><span>{list.title}</span></div>
                    ))}
                    <button onClick={() => createWatchlist()}><i className="fa-solid fa-plus"></i> Watchlist</button>
                </div>

                <div className='watchlist-items'>
                    { watchlistCoins && watchlistCoins.map((coin) => (
                        <div>
                            <p className='watchlist-price'>
                                <span style={{ color: "#ffffff"}}>{coin.symbol}</span>
                                <span>
                                    <span style={{ color: "#c4c4c4"}}>{Number(Number(coin.lastPrice).toFixed(1)).toLocaleString()}</span>
                                    <span style={{ color: coin.priceChange > 0 ? "#008000" : "#ff0000"}}>{Number(Number(coin.priceChangePercent).toFixed(1)).toLocaleString()}%</span>
                                </span>
                            </p>
                            <p className='watchlist-action'>
                                <NavLink className='nav' to='/chart' state={coin.symbol} ><i className="fa-solid fa-chart-line"></i></NavLink>
                                <NavLink style={{ color: "#059669"}} className='nav' to='/order' state={{ symbol: coin.symbol }}><i className="fa-solid fa-bolt"></i></NavLink>
                            </p>
                        </div>
                    ))}
                    {watchlistCoins.length === 0 ? <p style={{ textAlign: "center", color: "#c4c4c4", padding: "25px 0"}}>No coins yet. <br></br> Tap "Add Symbol" below to get started.</p> : ""}
                    <button onClick={() => searchSecToggle()} className='add-symbol-btn'><i className="fa-solid fa-plus"></i> Add Symbol</button>
                </div>
            </div>
        </div>
    )
}


export default Watchlist;