import Holding from "../models/holding.js";
import Position from "../models/position.js";



/** Profit & Loss */
export const getPnL = async (req, res) => {
    const closedHoldings = await Holding.find({ user: req.user._id, status: "CLOSED" }).select("-status -quantity -totalSoldQty");
    const closedPositions = await Position.find({ user: req.user._id, status: "CLOSED" }).select("-status");

    res.status(201).json({
        message: "P&L statement fetched",
        holdings: closedHoldings,
        positions: closedPositions,
    });
};