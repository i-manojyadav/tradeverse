import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { CryptoAPIContext } from "./CryptoAPIContext";

export const PositionsContext = createContext();

export default function PositionsProvider({ children }) {

    const { user } = useContext(AuthContext);
    const { coins } = useContext(CryptoAPIContext);

    const [ positions, setPositions ] = useState([]);
    const [ positionsStats, setPositionsStats ] = useState([]);
    const [ enrichedPositions, setEnrichedPositions ] = useState([]);


    /** Positions Data */
    useEffect(() => {

        if (user === null) return;
        setPositions(user.positions);

    }, [user]);


    /** Updating Position Data */
    useEffect(() => {

        const updatedPositions = positions.map((position) => {
            const coin = coins.find((c) => {
                return position.symbol === c.symbol;
            });

            if (!coin) return null;

            if (position.side === "BUY") {
                return {
                    symbol: position.symbol,
                    side: position.side,
                    quantity: position.quantity,
                    averagePrice: position.averagePrice,
                    ltp: coin.lastPrice,
                    invested: Number(position.averagePrice) * Number(position.quantity),
                    currentValue: Number(coin.lastPrice) * Number(position.quantity),
                    pnl: (Number(coin.lastPrice) - Number(position.averagePrice)) * Number(position.quantity),
                    roi: ((Number(coin.lastPrice) - Number(position.averagePrice)) / Number(position.averagePrice)) * 100,
                }
            } else if (position.side === "SELL") {
                return {
                    symbol: position.symbol,
                    side: position.side,
                    quantity: position.quantity,
                    averagePrice: position.averagePrice,
                    ltp: coin.lastPrice,
                    invested: Number(position.averagePrice) * Number(position.quantity),
                    currentValue: Number(coin.lastPrice) * Number(position.quantity),
                    pnl: (Number(position.averagePrice) - Number(coin.lastPrice)) * Number(position.quantity),
                    roi: ((Number(position.averagePrice) - Number(coin.lastPrice)) / Number(position.averagePrice)) * 100,
                }
            }
        }).filter(Boolean);

        setEnrichedPositions(updatedPositions);

    }, [coins]);


    /** Positions Stats */
    useEffect(() => {

        const invested = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.invested);
        }, 0);

        const currentValue = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.currentValue);
        }, 0);

        const pnl = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.pnl);
        }, 0);

        const roi = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.roi);
        }, 0);

        setPositionsStats({
            invested: invested,
            currentValue: currentValue,
            pnl: pnl,
            roi: roi,
        });

    }, [coins]);


    return (
        <PositionsContext.Provider
        value={{ enrichedPositions, positionsStats }}
        >

            { children }

        </PositionsContext.Provider>
    )
}