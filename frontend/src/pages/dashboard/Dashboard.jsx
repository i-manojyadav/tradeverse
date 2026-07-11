import { useContext, useEffect, useState } from 'react';
import './Dashboard.css';
import { BarChart } from '@mui/x-charts/BarChart';
import { AuthContext } from '../../context/AuthContext';
import OrderPanel from '../../components/orderPanel/OrderPanel';
import { HoldingsContext } from '../../context/HoldingsContext';
import { CryptoAPIContext } from '../../context/CryptoAPIContext';

function Dashboard() {

    const { user } = useContext(AuthContext);
    const { coins } = useContext(CryptoAPIContext);
    const { enrichedHoldings, holdingsStats } = useContext(HoldingsContext);

    const [ chartData, setChartData ] = useState([]);

    useEffect(() => {
        
        const data = enrichedHoldings.map((holding) => {
            return {
                symbol: holding.symbol,
                pnl: holding.pnl,
            }
        });

        setChartData(data);

    }, [coins]);


    return (
        <div className='dashboard'>
            <div className='dashbaord-greet'>
                <p>Hi, {user?.user?.name || "User"}</p>
            </div>
            <div className='dashboard-holdings'>
                <h3>Holdings</h3>
                <BarChart
                    className='dashboard-chart'
                    dataset={chartData}
                    xAxis={[
                        {
                            scaleType: "band",
                            dataKey: "symbol"
                        },
                    ]}
                    series={[
                        {
                            dataKey: "pnl",
                            label: "Profit & Loss",
                            color: "#b1ffa7",
                        }
                    ]}
                    height={300}
                >
                </BarChart>
            </div>
        </div>
    )
}


export default Dashboard;