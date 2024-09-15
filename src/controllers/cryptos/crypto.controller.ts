import CoingeckoService from "../../services/getters/coingecko.service";
import CryptoMessageBuilder from "../../message-builders/crypto.message-builder";
import {getCurrentPrice, getPriceChange1h} from "../../utils/coin.coingecko.utils";
import {ICryptoGetPrice} from "../../interfaces/cryptos.interface";

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

    async get1hPricePost(): Promise<ICryptoGetPrice> {
        const response = await this.getCachedPriceData();
        const currentPrice = getCurrentPrice(response);
        const priceChange1h = getPriceChange1h(response);
        const postText = this.messageBuilder.createCurrentPriceAnd1hChangeSummary(currentPrice, priceChange1h);
        return { currentPrice, priceChange1h: Number(priceChange1h), postText };
    };

    async get24hPost(): Promise<ICryptoGetPrice> {
        const priceData = await this.getCachedPriceData();
        const postText = this.messageBuilder.create24hPriceUpdateSummary(priceData);
        return { postText };
    };

}

