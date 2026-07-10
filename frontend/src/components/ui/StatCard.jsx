import './StatCard.css';

function StatCard({ title, value, subTitle, isPnL, roi }) {

    let valueColor = "#f0f0f0";
    if (isPnL) {
        valueColor = value >= 0 ? "#008000" : "#ff0000";
    }

    return (
        <div className='stat-card'>
            <p className='stat-title'>{title}</p>
            <p className='stat-value' style={{ color: valueColor }}>{Number(Number(value).toFixed(2)).toLocaleString()} <span className='roi' style={{display: isPnL ? "inline-block" : "none"}}>({Number(Number(roi).toFixed(1)).toLocaleString()}%)</span></p>
            <p className='stat-sub-title'>{subTitle}</p>
        </div>
    )
}


function StatCardMobile({ invested, current, pnl, roi }) {
    return (
        <div className='stat-card-mobile'>
            <div className='stat-value-sec'>
                <div className='stat-inv-value'>
                    <p className='stat-title-m'>Invested</p>
                    <p className='stat-value-m'>{Number(Number(invested).toFixed(2)).toLocaleString()}</p>
                </div>
                <div>
                    <p className='stat-title-m'>Current</p>
                    <p className='stat-value-m'>{Number(Number(current).toFixed(2)).toLocaleString()}</p>
                </div>
            </div>
            <span className='stat-card-border'></span>
            <div className='stat-pnl'>
                <p className='stat-title-m'>P&L</p>
                <p className='stat-value-m' style={{color: pnl >= 0 ? "#008000" : "#ff0000"}}>{Number(Number(current).toFixed(2)).toLocaleString()} ({Number(Number(roi).toFixed(1)).toLocaleString()}%)</p>
            </div>
        </div>
    )
}


export { StatCard, StatCardMobile };