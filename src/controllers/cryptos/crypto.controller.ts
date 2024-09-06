import CoingeckoService from "../../services/getters/coingecko.service";
import CryptoMessageBuilder from "../../message-builders/crypto.message-builder";

export default class CryptoController {
    protected coingeckoService: CoingeckoService;
    protected messageBuilder: CryptoMessageBuilder;

    constructor(coinId: string, currency: string, private nameTag: string) {
        this.coingeckoService = new CoingeckoService(coinId, currency);
        this.messageBuilder = new CryptoMessageBuilder(nameTag);
    }

    async get1hPricePost() {
        try {
            const response = await this.coingeckoService.fetchPriceData();
            return this.messageBuilder.createCurrentPriceAnd1hChangeSummary(response);
        } catch (error) {
            console.error(
                `Error occurred in post1hPrice for ${this.nameTag}:`,
                error.message,
                error.stack
            );
        }
    };

    async get24hPricePost() {
        try {
            const priceData = await this.coingeckoService.fetchPriceData();
            return this.messageBuilder.create24hPriceUpdateSummary(priceData);
        } catch (error) {
            console.error(
                `Error occurred in post24hPrice for ${this.nameTag}:`,
                error.message,
                error.stack
            );
        }
    };
}

