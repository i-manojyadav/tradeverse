import { createContext, useEffect, useState } from "react";
import CryptoData from "../services/cryptoAPI";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CryptoAPIContext = createContext();

export default function CryptoAPIProvider({ children }) {

    const { user } = useContext(AuthContext);

    const [ coins, setCoins ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await CryptoData();
            setCoins(data);
        }

        if (user === null) return;
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);

    }, [user]);

    return (
        <CryptoAPIContext.Provider
        value={{ coins }}>

            { children }

        </CryptoAPIContext.Provider>
    )
}