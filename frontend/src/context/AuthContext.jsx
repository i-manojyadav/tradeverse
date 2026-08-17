import { createContext, useContext, useEffect, useState } from "react";
import { WatchlistContext } from "./WatchlistContext";
import AppAlert from "../components/ui/AppAlert";

const url = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const isSignedIn = async () => {
            const response = await fetch(`${url}/user`, {
                credentials: "include",
            });

            if (response.ok) {
                <AppAlert msg={data.message} severity={"success"} />
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