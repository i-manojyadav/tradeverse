import Wallet from "../models/wallet.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import Order from "../models/order.js";


const updateWallet = async (order, transaction) => {

    let orderValue = order.price * order.quantity;
    let marginUsed = await calculateMargin(order);

    const wallet = await Wallet.findOne({ user: order.user });

    if (order.mode === "TRADE") {

        const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

        if (!position || position.side === order.side) {
            wallet.funds -= marginUsed;
            transaction.walletEffect = "DEBIT";
            
        } else {
            wallet.funds += marginUsed;
            transaction.walletEffect = "CREDIT";
        }

    } else if (order.mode === "INVEST") {

        const holding = await Holding.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });
        
        if (order.side === "BUY") {
            wallet.funds -= orderValue;
            transaction.walletEffect = "DEBIT";

        } else if (order.side === "SELL") {

            if (!holding) {
                console.log("Can not sell. No holding found");
                return;
            }

            if (holding.quantity < order.quantity) {
                console.log("Insufficient quantity.");
                return;
            }

            wallet.funds += orderValue;
            transaction.walletEffect = "CREDIT";
        }
    }

    await wallet.save();
}


const calculateMargin = async (order) => {

    if (order.mode === "INVEST") return;

    let orderValue = Number(order.price) * Number(order.quantity);
    let marginUsed = orderValue / Number(order.leverage);

    if (order.mode === "TRADE") {

        if (order.type === "LIMIT") {
            marginUsed = marginUsed;

        } else if (order.type === "STOP_LOSS" || order.type === "TARGET") {

            const mainOrder = await Order.findOne({ _id: order.parentOrder });
            marginUsed = (Number(mainOrder.price) * Number(order.quantity)) / Number(order.leverage);

            if (mainOrder.side === "BUY" && order.side === "SELL") {
                let pnl = (Number(order.price) - Number(mainOrder.price)) * Number(order.quantity);
                marginUsed += pnl;

            } else if (mainOrder.side === "SELL" && order.side === "BUY") {
                let pnl = (Number(mainOrder.price) - Number(order.price)) * Number(order.quantity);
                marginUsed += pnl;
            }
        }
    }

    return marginUsed;

}


export default updateWallet;