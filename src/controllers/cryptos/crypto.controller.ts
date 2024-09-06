import { Cache } from 'node-ts-cache';
import CoingeckoService from "../../services/getters/coingecko.service";
import CryptoMessageBuilder from "../../message-builders/crypto.message-builder";
import { myCache } from "../../utils/cache.utils";

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
        return this.messageBuilder.createCurrentPriceAnd1hChangeSummary(response);
    };

    async get24hPricePost() {
        const priceData = await this.getCachedPriceData();
        return this.messageBuilder.create24hPriceUpdateSummary(priceData);
    };
}

