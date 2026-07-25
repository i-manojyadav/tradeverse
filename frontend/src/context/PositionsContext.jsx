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

                const marginUsed = (Number(position.averagePrice) * Number(position.quantity)) / Number(position.leverage);
                const pnl = (Number(coin.lastPrice) - Number(position.averagePrice)) * Number(position.quantity);

                return {
                    symbol: position.symbol,
                    side: position.side,
                    quantity: position.quantity,
                    averagePrice: position.averagePrice,
                    leverage: position.leverage,
                    ltp: coin.lastPrice,
                    marginUsed: marginUsed,
                    positionValue: Number(coin.lastPrice) * Number(position.quantity),
                    pnl: pnl,
                    roi: (pnl / marginUsed) * 100,
                    liquidationPrice: position.liquidationPrice,
                }
            } else if (position.side === "SELL") {

                const marginUsed = (Number(position.averagePrice) * Number(position.quantity)) / Number(position.leverage);
                const pnl = (Number(position.averagePrice) - Number(coin.lastPrice)) * Number(position.quantity);

                return {
                    symbol: position.symbol,
                    side: position.side,
                    quantity: position.quantity,
                    averagePrice: position.averagePrice,
                    leverage: position.leverage,
                    ltp: coin.lastPrice,
                    marginUsed: marginUsed,
                    positionValue: Number(coin.lastPrice) * Number(position.quantity),
                    pnl: pnl,
                    roi: (pnl / marginUsed) * 100,
                    liquidationPrice: position.liquidationPrice,
                }
            }
        }).filter(Boolean);

        setEnrichedPositions(updatedPositions);

    }, [coins]);


    /** Positions Stats */
    useEffect(() => {

        const marginUsed = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.marginUsed);
        }, 0);

        const positionValue = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.positionValue);
        }, 0);

        const pnl = enrichedPositions.reduce((sum, coin) => {
            return sum + Number(coin.pnl);
        }, 0);

        const roi = (pnl / marginUsed) * 100 || 0;

        setPositionsStats({
            marginUsed: marginUsed,
            positionValue: positionValue,
            pnl: pnl,
            roi: roi,
        });

    }, [enrichedPositions]);


    return (
        <PositionsContext.Provider
        value={{ enrichedPositions, positionsStats }}
        >

            { children }

        </PositionsContext.Provider>
    )
}