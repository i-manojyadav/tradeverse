import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { CryptoAPIContext } from "./CryptoAPIContext";

export const HoldingsContext = createContext();

export default function HoldingsProvider({ children }) {

    const { user } = useContext(AuthContext);
    const { coins } = useContext(CryptoAPIContext);

    const [ holdings, setHoldings ] = useState([]);
    const [ holdingsStats, setHoldingsStats ] = useState({});
    const [ enrichedHoldings, setEnrichedHoldings ] = useState([]);


    /** Holdings Data */
    useEffect(() => {

        if (user === null) return;
        setHoldings(user.holdings);

    }, [user]);


    /** Updating Holding Data */
    useEffect(() => {

        const updatedHoldings = holdings.map((holding) => {
            const coin = coins.find((c) => {
                return holding.symbol === c.symbol;
            });

            if (!coin) return null;

            return {
                symbol: holding.symbol,
                quantity: holding.quantity,
                averageBuy: holding.averageBuy,
                ltp: coin.lastPrice,
                invested: Number(holding.averageBuy) * Number(holding.quantity),
                currentValue: Number(coin.lastPrice) * Number(holding.quantity),
                pnl: (Number(coin.lastPrice) - Number(holding.averageBuy)) * Number(holding.quantity),
                roi: ((Number(coin.lastPrice) - Number(holding.averageBuy)) / Number(holding.averageBuy)) * 100,
            }

        }).filter(Boolean);

        setEnrichedHoldings(updatedHoldings);

    }, [coins]);


    /** Holdings Stats */
    useEffect(() => {

        const invested = enrichedHoldings.reduce((sum, coin) => {
            return sum + Number(coin.invested);
        }, 0);

        const currentValue = enrichedHoldings.reduce((sum, coin) => {
            return sum + Number(coin.currentValue);
        }, 0);

        const pnl = enrichedHoldings.reduce((sum, coin) => {
            return sum + Number(coin.pnl);
        }, 0);

        const roi = enrichedHoldings.reduce((sum, coin) => {
            return sum + Number(coin.roi);
        }, 0);

        setHoldingsStats({
            invested: invested,
            currentValue: currentValue,
            pnl: pnl,
            roi: roi,
        });

    }, [coins]);


    return (
        <HoldingsContext.Provider
        value={{ enrichedHoldings, holdingsStats }}
        >

            { children }

        </HoldingsContext.Provider>
    )
}