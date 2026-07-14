import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const WatchlistContext = createContext();

export default function WatchlistProvider({ children }) {

    const { user } = useContext(AuthContext);
    const [ watchlist, setWatchlist ] = useState([]);


    useEffect(() => {
        if (user === null) return;
        setWatchlist(user.watchlist);
    }, [user]);

    
    return (
        <WatchlistContext.Provider
        value={{ watchlist, setWatchlist }}>
            
            { children }

        </WatchlistContext.Provider>
    )
}