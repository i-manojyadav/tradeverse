import { useState } from 'react';
import './Transactions.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import NoTradingActivity from '../emptyStates/NoTradingActivity';

function Transactions({ transactions }) {

    const isMobile = window.innerWidth <= 768;
    const isDesktop = window.innerWidth > 768;

    const [ isActive, setIsActive ] = useState(false);
    const [ curTxn, setCurTxn ] = useState([]);

    function handlePopup(txn) {
        if (isActive) {
            setIsActive(false);
            return;
        }
        if (!txn) return;
        setCurTxn(txn);
        setIsActive(true);
    }



    return (
        <>
        {(transactions.length > 0 && isDesktop) && <div className='transactions'>
            <TableContainer className='MUI-table'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Side</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Cr/Dr</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{transaction.symbol}</TableCell>
                                <TableCell>{`${transaction.mode} (${transaction.leverage}X)`}</TableCell>
                                <TableCell>{transaction?.type?.replace("_", " ")}</TableCell>
                                <TableCell>{transaction.side}</TableCell>
                                <TableCell>{Number(transaction.quantity).toLocaleString()}</TableCell>
                                <TableCell>{Number(transaction.averagePrice).toLocaleString()}</TableCell>
                                <TableCell>{Number(transaction.amount).toLocaleString()}</TableCell>
                                <TableCell>{transaction.walletEffect}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>}

        {(transactions.length > 0 && isMobile) && <div className='mobile-transaction-items'>
            {transactions.map((txn, idx) => (
                <div className='mti' key={idx} onClick={() => handlePopup(txn)}>
                    <div className='mti-left'>
                        <p>
                            <span className='mti-symbol'>{txn.symbol}</span>
                        </p>
                        <p>
                            <span>
                                <span className='mti-title'>Avg.</span> <span className='mti-value'>{Number(Number(txn.averagePrice).toFixed(2)).toLocaleString()}</span>
                            </span>
                            ·
                            <span>
                                <span className='mti-title'>Qty.</span> <span className='mti-value'>{Number(Number(txn.quantity).toFixed(2)).toLocaleString()}</span>
                            </span>
                        </p>
                    </div>
                    <div className='mti-right'>
                        <p className='mti-price'>
                            <span style={{color: txn.walletEffect === "CREDIT" ? "#008000" : "#ff0000"}}>{txn.walletEffect === "CREDIT" ? "+" : "-"}{Number(Number(txn.amount).toFixed(2)).toLocaleString()}</span>
                        </p>
                        <p>
                            <span className='mti-title'>{txn.walletEffect}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>}

        {(transactions.length > 0 && isActive && isMobile) && <div className='transaction-overview'>
            <div className='overview-top'>
                <p>
                    <span className='overview-symbol'>{curTxn.symbol}</span>
                    <span style={{ fontSize: "13px"}}><span>{curTxn.walletEffect}</span>: <span style={{color: curTxn.walletEffect === "CREDIT" ? "#008000" : "#ff0000"}}>{curTxn.walletEffect === "CREDIT" ? "+" : "-"}{Number(Number(curTxn.amount).toFixed(2)).toLocaleString()}</span></span>
                </p>
                <p style={{color: "red"}}>
                    <i onClick={() => handlePopup()} className="fa-solid fa-xmark"></i>
                </p>
            </div>
            <div className='overview-data'>
                <p>
                    <span className='overview-title'>Date</span>
                    <span className='overview-value'>{new Date(curTxn.createdAt).toLocaleDateString()}</span>
                </p>
                <p>
                    <span className='overview-title'>Mode</span>
                    <span className='overview-value'>{curTxn.mode}</span>
                </p>
                {curTxn.type && <p>
                    <span className='overview-title'>Type</span>
                    <span className='overview-value'>{curTxn.type}</span>
                </p>}
                <p>
                    <span className='overview-title'>Side</span>
                    <span className='overview-value'>{curTxn.side}</span>
                </p>
                {curTxn.leverage && <p>
                    <span className='overview-title'>Leverage</span>
                    <span className='overview-value'>{curTxn.leverage}x</span>
                </p>}
            </div>
        </div>}

        {transactions.length === 0 && <NoTradingActivity />}
        </>
    )
}


export default Transactions;