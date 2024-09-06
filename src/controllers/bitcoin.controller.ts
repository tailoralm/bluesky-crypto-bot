
import {
    create24hPriceUpdateSummary,
    createCurrentPriceAnd1hChangeSummary
} from "../message-builders/bitcoin.message-builder";
import BlueskyService from "../services/publishers/bluesky.service";
import CoingeckoService from "../services/getters/coingecko.service";
import CryptoMessageBuilder from "../message-builders/crypto.message-builder";

export default class BitcoinController {
    bitcoinService: CoingeckoService;
    blueskyService: BlueskyService;
    messageBuilder: CryptoMessageBuilder;
    constructor() {
        this.bitcoinService = new CoingeckoService('bitcoin', 'usd');
        this.blueskyService = new BlueskyService(process.env.BLUESKY_HANDLE, process.env.BLUESKY_PASSWORD);
        this.messageBuilder = new CryptoMessageBuilder('Bitcoin');
    }

    async postBitcoin1hPrice() {
        try {
            const response = await this.bitcoinService.fetchPriceData();

            const summaryMessage = this.messageBuilder.createCurrentPriceAnd1hChangeSummary(response);
            this.blueskyService.postBlueSky(summaryMessage);
            // await postBlueSky(summaryMessage);

        } catch (error) {
            console.error(
                "Error occurred in postBlueSkyBitcoin1hPriceUpdate:",
                error.message,
                error.stack
            );
        }
    };

    async postBitcoin24hPrice() {
        try {
            const priceData = await this.bitcoinService.fetchPriceData();

            const summaryMessage = this.messageBuilder.create24hPriceUpdateSummary(priceData);
            this.blueskyService.postBlueSky(summaryMessage);
            // await postBlueSky(summaryMessage);

            console.log("BlueSky post successfully created. Message:", summaryMessage);
        } catch (error) {
            console.error(
                "Error in postBlueSkyBitcoin24hPriceUpdate:",
                error.message,
                error.stack
            );
        }
    };
}

