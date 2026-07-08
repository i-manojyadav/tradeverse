import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";

export const OrdersContext = createContext();

export default function OrdersProvider({ children }) {

    const { user } = useContext(AuthContext);
    const [ orders, setOrders ] = useState([]);

    useEffect(() => {

        if (user === null) return;
        setOrders(user.orders);

    }, [user]);

    return (
        <OrdersContext.Provider
        value={{ orders, setOrders }}
        >
            { children }
        </OrdersContext.Provider>
    )
}