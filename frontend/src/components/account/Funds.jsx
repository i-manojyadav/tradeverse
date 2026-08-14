import { useContext, useEffect, useState } from 'react';
import './Funds.css';
import { AuthContext } from '../../context/AuthContext';
import Transactions from './Transactions'

function Funds() {

    const { user } = useContext(AuthContext);

    const userTransactions = user?.transactions;
    const [ activeFilter, setActiveFilter ] = useState("ALL");
    const [ transactions, setTransactions ] = useState([]);


    /** Transactions Filter */
    useEffect(() => {
        if (!userTransactions) return;

        if (activeFilter === "ALL") {
            setTransactions(userTransactions);

        } else if (activeFilter === "CREDIT") {
            const creditTransactions = userTransactions.filter((transaction) => {
                return transaction.walletEffect === "CREDIT";
            });
            setTransactions(creditTransactions);

        } else if (activeFilter === "DEBIT") {
            const debitTransactions = userTransactions.filter((transaction) => {
                return transaction.walletEffect === "DEBIT";
            });
            setTransactions(debitTransactions);
        }

    }, [activeFilter]);

    

    return (
        <div className='user-funds'>
            <div className='funds'>
                <p>Available Funds</p>
                <p className='available-funds'>{Number(Number(user?.wallet?.funds).toFixed(1)).toLocaleString()}</p>
            </div>

            <div className='funds-transactions'>
                <div className='transactions-filter'>
                    <button className={activeFilter === "ALL" ? "trans-flt-btn-active" : "trans-flt-btn"} onClick={() => setActiveFilter("ALL")}>ALL</button>
                    <button className={activeFilter === "CREDIT" ? "trans-flt-btn-active" : "trans-flt-btn"} onClick={() => setActiveFilter("CREDIT")}>CREDIT</button>
                    <button className={activeFilter === "DEBIT" ? "trans-flt-btn-active" : "trans-flt-btn"} onClick={() => setActiveFilter("DEBIT")}>DEBIT</button>
                </div>

                <Transactions transactions={transactions} />
            </div>
        </div>
    )
}


export default Funds;