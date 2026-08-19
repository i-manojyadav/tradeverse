const URL = process.env.CRYPTO_API_URL;

const CryptoData = async () => {
    const response = await fetch(URL);
    console.log("Crypto API Status:", response.status);

    if (response.status === 418) {
        const retryAfter = response.headers.get("Retry-After");
        console.log("Retry After:", retryAfter);
        return;
    }

    const data = await response.json();
    if (!Array.isArray(data)) return;
    const USDTCoins = data?.filter((coin) => {
        return coin.symbol.endsWith("USDT");
    });
    return USDTCoins;
}

export default CryptoData;