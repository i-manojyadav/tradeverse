import { createContext, useEffect, useState } from "react";
import CryptoData from "../services/cryptoAPI";

export const CryptoAPIContext = createContext();

export default function CryptoAPIProvider({ children }) {

    const [ coins, setCoins ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await CryptoData();
            setCoins(data);
        }

        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (
        <CryptoAPIContext.Provider
        value={{ coins }}>

            { children }

        </CryptoAPIContext.Provider>
    )
}