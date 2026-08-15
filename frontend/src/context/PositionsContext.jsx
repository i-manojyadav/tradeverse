import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { CryptoAPIContext } from "./CryptoAPIContext";

export const PositionsContext = createContext();

export default function PositionsProvider({ children }) {

    const { user } = useContext(AuthContext);
    const { coins } = useContext(CryptoAPIContext);

    const [ positions, setPositions ] = useState([]);
    const [ positionsStats, setPositionsStats ] = useState([]);
    const [ openPositions, setOpenPositions ] = useState([]);


    /** Positions Data */
    useEffect(() => {

        if (user === null) return;
        setPositions(user.positions);

    }, [user]);


    /** Updating Open Position Data */
    useEffect(() => {

        const updatedPositions = positions?.map((position) => {
            const coin = coins.find((c) => {
                return position.symbol === c.symbol;
            });

            if (!coin) return null;

            if (position.side === "BUY") {

                const marginUsed = (Number(position.entryPrice) * Number(position.quantity)) / Number(position.leverage);
                const pnl = (Number(coin.lastPrice) - Number(position.entryPrice)) * Number(position.quantity);

                return {
                    symbol: position.symbol,
                    side: position.side,
                    quantity: position.quantity,
                    entryPrice: position.entryPrice,
                    leverage: position.leverage,
                    ltp: coin.lastPrice,
                    marginUsed: marginUsed,
                    positionValue: Number(coin.lastPrice) * Number(position.quantity),
                    pnl: pnl,
                    roi: (pnl / marginUsed) * 100,
                    target: Number(position.target),
                    stopLoss: Number(position.stopLoss),
                    liquidationPrice: position.liquidationPrice,
                    status: position.status,
                }
            } else if (position.side === "SELL") {

                const marginUsed = (Number(position.entryPrice) * Number(position.quantity)) / Number(position.leverage);
                const pnl = (Number(position.entryPrice) - Number(coin.lastPrice)) * Number(position.quantity);

                return {
                    symbol: position.symbol,
                    side: position.side,
                    quantity: position.quantity,
                    entryPrice: position.entryPrice,
                    leverage: position.leverage,
                    ltp: coin.lastPrice,
                    marginUsed: marginUsed,
                    positionValue: Number(coin.lastPrice) * Number(position.quantity),
                    pnl: pnl,
                    roi: (pnl / marginUsed) * 100,
                    target: Number(position.target),
                    stopLoss: Number(position.stopLoss),
                    liquidationPrice: position.liquidationPrice,
                }
            }
        }).filter(Boolean);

        setOpenPositions(updatedPositions);

    }, [coins]);


    /** Positions Stats */
    useEffect(() => {

        const marginUsed = openPositions.reduce((sum, coin) => {
            return sum + Number(coin.marginUsed);
        }, 0);

        const positionValue = openPositions.reduce((sum, coin) => {
            return sum + Number(coin.positionValue);
        }, 0);

        const pnl = openPositions.reduce((sum, coin) => {
            return sum + Number(coin.pnl);
        }, 0);

        const roi = (pnl / marginUsed) * 100 || 0;

        setPositionsStats({
            marginUsed: marginUsed,
            positionValue: positionValue,
            pnl: pnl,
            roi: roi,
        });

    }, [openPositions]);


    return (
        <PositionsContext.Provider
        value={{ openPositions, positionsStats }}
        >

            { children }

        </PositionsContext.Provider>
    )
}