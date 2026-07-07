import { createContext, useState } from "react";

export const WatchlistContext = createContext();

export default function WatchlistProvider({ children }) {

    const [ watchlist, setWatchlist ] = useState([]);
    
    return (
        <WatchlistContext.Provider
        value={{ watchlist, setWatchlist }}>
            
            { children }

        </WatchlistContext.Provider>
    )
}