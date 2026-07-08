import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

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