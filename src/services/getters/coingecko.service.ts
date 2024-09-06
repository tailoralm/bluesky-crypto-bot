import axios from "axios";
import {IMarketChart} from "../../interfaces/coingecko.interface";

export default class CoingeckoService {
    private COINGECKO_API_URL: string;
    constructor(private COIN_ID: string, private CURRENCY: string) {
        this.COINGECKO_API_URL = process.env.COINGECKO_API_URL;
    }

    async fetchPriceData(days = 1, precision = 2): Promise<IMarketChart> {
        console.log('fetching for', this.COIN_ID);
        const endpoint = `${this.COINGECKO_API_URL}/coins/${this.COIN_ID}/market_chart`;

        const response = await axios.get(endpoint, {
            params: { vs_currency: this.CURRENCY, days: days, precision: precision },
        });
        return response.data;
    };
}

// import axios from "axios";
// import { Cache, CacheContainer } from 'node-ts-cache';
// import { MemoryStorage } from 'node-ts-cache-storage-memory';
// import {IMarketChart} from "../../interfaces/coingecko.interface";
//
// const myCache = new CacheContainer(new MemoryStorage());
//
//
// export default class CoingeckoService {
//     private COINGECKO_API_URL: string;
//     constructor(private COIN_ID: string, private CURRENCY: string) {
//         this.COINGECKO_API_URL = process.env.COINGECKO_API_URL;
//     }
//
//     async fetchPriceData(days = 1, precision = 2): Promise<IMarketChart> {
//         console.log('try fetch', this.COIN_ID);
//         const endpoint = `${this.COINGECKO_API_URL}/coins/${this.COIN_ID}/market_chart`;
//         const cacheId = `${endpoint}-${days}-${precision}`
//
//         const cachedPrice = await myCache.getItem<IMarketChart>(cacheId);
//         if (cachedPrice) return cachedPrice;
//
//         try {
//             console.log('fetching... ', this.COIN_ID);
//             const response = await axios.get(endpoint, {
//                 params: { vs_currency: this.CURRENCY, days: days, precision: precision },
//             });
//             await myCache.setItem(cacheId, response.data, {ttl: 60})
//             return response.data;
//         } catch (error) {
//             console.error("Error fetching price data for "+this.CURRENCY, error);
//             return { prices: [], market_caps: [], total_volumes: [] };
//         }
//     };
// }
//
