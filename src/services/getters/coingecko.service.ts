import axios from "axios";
import {IMarketChart} from "../../interfaces/coingecko.interface";

export default class CoingeckoService {
    private COINGECKO_API_URL: string;
    constructor(private COIN_ID: string, private CURRENCY: string) {
        this.COINGECKO_API_URL = process.env.COINGECKO_API_URL;
    }

    async fetchPriceData(days = 1, precision = 2): Promise<IMarketChart> {
        const endpoint = `${this.COINGECKO_API_URL}/coins/${this.COIN_ID}/market_chart`;
        try {
            const response = await axios.get(endpoint, {
                params: { vs_currency: this.CURRENCY, days: days, precision: precision },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching price data for "+this.CURRENCY, error);
            return { prices: [], market_caps: [], total_volumes: [] };
        }
    };
}

