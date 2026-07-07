import './Chart.css';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useRef, memo, useState } from 'react';

function Chart() {

    const { state } = useLocation();
    const symbol = "BTCUSDT";

    const container = useRef();
    const widgetRef = useRef(null);

    useEffect(
    () => {
        widgetRef.current.innerHTML = "";
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
            {
            "allow_symbol_change": true,
            "calendar": false,
            "details": false,
            "hide_side_toolbar": true,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "hide_volume": false,
            "hotlist": false,
            "interval": "15",
            "locale": "en",
            "save_image": true,
            "style": "1",
            "symbol": "BINANCE:${state || symbol}",
            "theme": "dark",
            "timezone": "Etc/UTC",
            "backgroundColor": "#0F0F0F",
            "gridColor": "rgba(242, 242, 242, 0.06)",
            "watchlist": [],
            "withdateranges": false,
            "compareSymbols": [],
            "studies": [],
            "autosize": true
            }`;
        
        widgetRef.current.appendChild(script);
        return () => {
            if (widgetRef.current) {
                widgetRef.current.innerHTML = "";
            }
        };
        },
        [state]
  );

    return (
        <div className='chart'>
            <div className='chart-container'>
                <div className="tradingview-widget-container" ref={widgetRef} style={{height: "100%", width: "100%" }}>
                <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
                </div>
            </div>
        </div>
    )
}


export default Chart;