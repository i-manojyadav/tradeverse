const URL = "https://api.binance.com/api/v3/ticker/24hr";

const CryptoData = async () => {
    const response = await fetch(URL);
    const data = await response.json();
    const USDTCoins = data.filter((coin) => {
        return coin.symbol.endsWith("USDT");
    });
    return USDTCoins;
}

CryptoData();

export default CryptoData;