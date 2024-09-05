import {fetchPriceData} from "../services/getters/bitcoinDataService";
import {
    create24hPriceUpdateSummary,
    createCurrentPriceAnd1hChangeSummary
} from "../messageBuilders/bitcoinMessageBuilders";
import {postBlueSky} from "../services/publishers/blueskyService";

export default class BitcoinController {
    async postBlueSkyBitcoin1hPriceUpdate() {
        try {
            const response = await fetchPriceData(
                process.env['COIN_ID'],
                process.env['CURRENCY']
            );

            if (!response) {
                throw new Error("No data returned from the fetchPriceData function.");
            }

            const summaryMessage = createCurrentPriceAnd1hChangeSummary(response);
            await postBlueSky(summaryMessage);

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
            const priceData = await fetchPriceData(
                process.env['COIN_ID'],
                process.env['CURRENCY']
            );

            if (!priceData) {
                throw new Error(
                    "Failed to fetch Bitcoin price data or received empty response."
                );
            }

            const summaryMessage = create24hPriceUpdateSummary(priceData);
            await postBlueSky(summaryMessage);

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

