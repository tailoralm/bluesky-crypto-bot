import axios from "axios";
import {IMarketChart} from "./coingecko.interface";
import * as Log from "../../utils/log.utils";

export default class CoingeckoService {
    private COINGECKO_API_URL: string;
    constructor(private COIN_ID: string, private CURRENCY: string) {
        this.COINGECKO_API_URL = process.env.COINGECKO_API_URL;
    }

    async fetchPriceData(days = 1, precision = 2): Promise<IMarketChart> {
        Log.log('fetching for', this.COIN_ID);
        const endpoint = `${this.COINGECKO_API_URL}/coins/${this.COIN_ID}/market_chart`;
        const response = await axios.get(endpoint, {
            params: { vs_currency: this.CURRENCY, days: days, precision: precision },
        });
        return response.data;
    };
}
