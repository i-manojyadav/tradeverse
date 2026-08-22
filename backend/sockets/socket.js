import Watchlist from "../models/watchlist.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import Order from "../models/order.js";

import orderMatch from "../services/orderMatcher.js";


let cryptoSocket = null;

let socketIO = null;

/** Create WebSocket Connection */
export function setupSocket(io) {
    socketIO = io;
    io.on('connection', (socket) => {
        console.log("Socket connected with client", socket.id);
        if (io.sockets.sockets.size === 1) {
            getCryptoData();
        }

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);
            if (io.sockets.sockets.size === 0) {
                cryptoSocket?.close();
                cryptoSocket = null;
            }
        });
    });
}

// Generate Streams Symbols
let streams = "";
async function streamSymbols() {

    const watchlists = await Watchlist.find({}, {"coins.symbol": 1, _id:0});
    const watchlistSymbols = watchlists.flatMap((watchlist) => {
        return watchlist.coins.map(coin => coin.symbol)
    });

    const orders = await Order.find({}, {"symbol": 1, _id:0});
    const orderSymbols = orders.flatMap((order) => {
        return order.symbol;
    });

    const holdings = await Holding.find({}, {"symbol": 1, _id:0});
    const holdingSymbols = holdings.flatMap((holding) => {
        return holding.symbol;
    });

    const positions = await Position.find({}, {"symbol": 1, _id:0});
    const positionSymbols = positions.flatMap((position) => {
        return position.symbol;
    });

    const symbols = [...new Set([...watchlistSymbols, ...orderSymbols, ...holdingSymbols, ...positionSymbols])];

    let streamSymbols = "";

    for (const symbol of symbols) {
        streamSymbols += symbol.toLowerCase()+"@ticker/";
    }

    streams = streamSymbols.slice(0, -1);

}

let cryptoCoins = [];
let isMatching = false;

/** Structure Web Socket Data */
async function filterCoins(coin) {

    for (const crypto of cryptoCoins) {

        if (crypto.symbol === coin.symbol) {
            crypto.lastPrice = coin.lastPrice;
            crypto.priceChange = coin.priceChange;
            crypto.priceChangePercentage = coin.priceChangePercentage;

            if (!isMatching) {
                isMatching = true;

                try {
                    await orderMatch(cryptoCoins);
                } finally {
                    isMatching = false;
                }
            }

            return;
        }
    }

    cryptoCoins.push(coin);
}


export async function getCryptoData() {

    if (cryptoSocket) return;

    await streamSymbols();

    cryptoSocket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    cryptoSocket.onopen = () => {
        console.log("Socket connected");
    }

    cryptoSocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        let coin = {
            symbol: data.data.s,
            lastPrice: data.data.c,
            priceChange: data.data.p,
            priceChangePercentage: data.data.P,
            askPrice: data.data.a,
            bidPrice: data.data.b,
        }

        await filterCoins(coin);
    }

    cryptoSocket.onclose = () => {
        console.log("Socket Disconnected");
        cryptoSocket = null;
    }
}