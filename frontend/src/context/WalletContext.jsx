import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const WalletContext = createContext();

export default function WalletProvider({ children }) {

    const { user } = useContext(AuthContext);
    const [ wallet, setWallet ] = useState([]);

    useEffect(() => {

        if (user === null) return;
        setWallet(user.wallet);

    }, [user]);

    return (
        <WalletContext.Provider
        value={{ wallet, setWallet }}>

            { children }

        </WalletContext.Provider>
    )
}