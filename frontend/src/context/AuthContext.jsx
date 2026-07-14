import { createContext, useContext, useEffect, useState } from "react";
import { WatchlistContext } from "./WatchlistContext";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const isSignedIn = async () => {
            const response = await fetch("http://localhost:3000/user", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        }

        isSignedIn();
    }, []);

    return (
        <AuthContext.Provider
        value={{ user, setUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}