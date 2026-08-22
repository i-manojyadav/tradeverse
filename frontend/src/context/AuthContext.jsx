import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const url = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    console.log("Auth Context Rendered");

    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const isSignedIn = async () => {
            const response = await fetch(`${url}/user`, {
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
            } else {
                console.log(data.message);
            }
        }

        isSignedIn();
    }, []);


    // Create Web Socket Connection
    useEffect(() => {
        if (!user?.user?.username) return;

        const socket = io(`${url}`);

        socket.on("connect", () => {
            console.log("Socket connected");
        });

        return () => {
            socket.disconnect();
        }

    }, [user?.user?.username]);

    return (
        <AuthContext.Provider
        value={{ user, setUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}