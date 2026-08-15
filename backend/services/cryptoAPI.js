const URL = "https://api.binance.com/api/v3/ticker/24hr";

const CryptoData = async () => {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("IS ARRAY",Array.isArray(data));
    console.log("DATA", data);
    const USDTCoins = data?.filter((coin) => {
        return coin.symbol.endsWith("USDT");
    });
    return USDTCoins;
}

export default CryptoData;