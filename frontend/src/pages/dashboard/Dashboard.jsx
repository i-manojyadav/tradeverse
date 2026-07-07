import { useContext } from 'react';
import './Dashboard.css';
import { BarChart } from '@mui/x-charts/BarChart';
import { AuthContext } from '../../context/AuthContext';

function Dashboard() {

    const { user } = useContext(AuthContext);

    const data = [
        {symbol: "BTCUSDT", pnl: 2200},
        {symbol: "ETHUSDT", pnl: 1700},
        {symbol: "LTCUSDT", pnl: 105},
        {symbol: "DOGUSDT", pnl: 1200},
        {symbol: "SOLUSDT", pnl: 692},
    ]

    return (
        <div className='dashboard'>
            <div className='dashbaord-greet'>
                <h2>Hello, {user?.user?.name || "User"}</h2>
            </div>
            <div className='dashboard-holdings'>
                <div className='dashboard-holdings-value'>
                    <div className='dashboard-pnl-value'>
                        <p>25L</p>
                        <p>P&L</p>
                    </div>
                    <div className='dashboard-investments-value'>
                        <p><span>Investment</span> <span>50L</span></p>
                        <p><span>Current Value</span> <span>75L</span></p>
                    </div>
                </div>
                <div className='dashboard-holdings-chart'>
                    <BarChart
                        className='dashboard-holding-value-chart'
                        dataset={data}
                        xAxis={[
                            {
                                scaleType: "band",
                                dataKey: "symbol"
                            },
                        ]}
                        series={[
                            {
                                dataKey: "pnl",
                                label: "Profit & Loss"
                            }
                        ]}
                        height={300}
                    >
                    </BarChart>
                </div>
            </div>
        </div>
    )
}


export default Dashboard;