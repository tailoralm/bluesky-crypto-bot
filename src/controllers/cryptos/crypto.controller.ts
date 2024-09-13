import { Cache } from 'node-ts-cache';
import CoingeckoService from "../../services/getters/coingecko.service";
import CryptoMessageBuilder from "../../message-builders/crypto.message-builder";
import { myCache } from "../../utils/cache.utils";
import {getCurrentPrice, getPriceChange1h} from "../../utils/coin.coingecko.utils";

export default class CryptoController {
    protected coingeckoService: CoingeckoService;
    protected messageBuilder: CryptoMessageBuilder;

    constructor(coinId: string, currency: string, private nameTag: string) {
        this.coingeckoService = new CoingeckoService(coinId, currency);
        this.messageBuilder = new CryptoMessageBuilder(nameTag);
    }

    protected getCachedPriceData(){
        return this.coingeckoService.fetchPriceData();
    }

    async get1hPricePost() {
        const response = await this.getCachedPriceData();
        const currentPrice = getCurrentPrice(response);
        const priceChange1h = getPriceChange1h(response);
        const postText = this.messageBuilder.createCurrentPriceAnd1hChangeSummary(currentPrice, priceChange1h);
        return { currentPrice, priceChange1h: Number(priceChange1h), postText };
    };

    async get24hPost() {
        const priceData = await this.getCachedPriceData();
        return this.messageBuilder.create24hPriceUpdateSummary(priceData);
    };
}

