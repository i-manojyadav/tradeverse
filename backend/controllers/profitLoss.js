import Holding from "../models/holding.js";
import Position from "../models/position.js";



/** Profit & Loss */
export const getPnL = async (req, res) => {
    const closedPositions = await Position.find({ user: req.user._id, status: "CLOSED" });

    res.status(201).json({
        message: "P&L statement fetched",
        positions: closedPositions,
    });
};