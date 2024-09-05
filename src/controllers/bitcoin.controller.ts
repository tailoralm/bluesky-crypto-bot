import BitcoinService from "../services/getters/bitcoin.service";
import {
    create24hPriceUpdateSummary,
    createCurrentPriceAnd1hChangeSummary
} from "../messageBuilders/bitcoin.message-builder";
import {postBlueSky} from "../services/publishers/bluesky.service";

export default class BitcoinController {
    bitcoinService: BitcoinService
    constructor() {
        this.bitcoinService = new BitcoinService();
    }

    async getPrice() {
        const priceData = await this.bitcoinService.fetchPriceData();
        if (!priceData)
            throw new Error(
                "Failed to fetch Bitcoin price data or received empty response."
            );
        console.log(priceData);
        return priceData;
    }
    async postBlueSkyBitcoin1hPriceUpdate() {
        try {
            const response = await this.getPrice();

            const summaryMessage = createCurrentPriceAnd1hChangeSummary(response);
            // await postBlueSky(summaryMessage);

            console.log("BlueSky post successfully created. Message:", summaryMessage);
        } catch (error) {
            console.error(
                "Error occurred in postBlueSkyBitcoin1hPriceUpdate:",
                error.message,
                error.stack
            );
        }
    };

    async postBlueSkyBitcoin24hPriceUpdate() {
        try {
            const priceData = await this.getPrice();

            const summaryMessage = create24hPriceUpdateSummary(priceData);
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

