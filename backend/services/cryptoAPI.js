const URL = process.env.CRYPTO_API_URL;

const CryptoData = async () => {
    const response = await fetch(URL);
    
    const retryAfter = response.headers.get("Retry-After");

    console.log("Crypto API Status:", response.status);

    const data = await response.json();
    if (!Array.isArray(data)) return;

    const USDTCoins = data?.filter((coin) => {
        return coin.symbol.endsWith("USDT");
    });

    return {
        cryptoCoins: USDTCoins,
        status: response.status,
        retryTime: retryAfter,
    }
}

export default CryptoData;