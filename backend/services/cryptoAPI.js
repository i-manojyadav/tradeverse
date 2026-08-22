const URL = process.env.CRYPTO_API_URL;

const CryptoData = async () => {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    
    const retryAfter = response.headers.get("Retry-After");

    console.log("Crypto API Status:", response.status);

    const data = await response.json();

    if (!Array.isArray(data)) {
        return {
            cryptoCoins: null,
            status: response.status,
            retryAfter,
        }
    }

    const USDTCoins = data?.filter((coin) => {
        return coin.symbol.endsWith("USDT");
    });

    return {
        cryptoCoins: USDTCoins,
        status: response.status,
        retryAfter,
    }
}

export default CryptoData;