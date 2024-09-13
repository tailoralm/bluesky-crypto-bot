import BitcoinController from "./cryptos/bitcoin.controller";
import EtherController from "./cryptos/ether.controller";
import SolanaController from "./cryptos/solana.controller";
import BlueskyService from "../services/publishers/bluesky.service";
import {ITimePost, myCache} from "../utils/cache.utils";

export default class CoinsController {
    // Create Posts
    bitcoinController: BitcoinController;
    etherController: EtherController;
    solanaController: SolanaController;

    // Accoutns services
    btcPriceAccount: BlueskyService;
    etherPriceAccount: BlueskyService;
    solPriceAccount: BlueskyService;
    cryptoPriceAccount: BlueskyService;

    private readonly SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;

    constructor() {
        this.bitcoinController = new BitcoinController();
        this.etherController = new EtherController();
        this.solanaController = new SolanaController();
        this.btcPriceAccount = new BlueskyService(process.env.BLUESKY_BTC_USER, process.env.BLUESKY_BTC_PASSWORD);
        this.etherPriceAccount = new BlueskyService(process.env.BLUESKY_ETHER_USER, process.env.BLUESKY_ETHER_PASSWORD);
        this.solPriceAccount = new BlueskyService(process.env.BLUESKY_SOLANA_USER, process.env.BLUESKY_SOLANA_PASSWORD);
        this.cryptoPriceAccount = new BlueskyService(process.env.BLUESKY_CRYPTO_USER, process.env.BLUESKY_CRYPTO_PASSWORD);
    }

    async postSingleCryptos1hIfVariation(minVariation: number) {
        try {
            console.log('minVariation:', minVariation);
            const currentTimestamp = Date.now();
            const lastPostTimestamp: ITimePost = JSON.parse(await myCache.getItem('lastPostTimestamp'));
            const isMoreThan6HoursBTC  = !lastPostTimestamp || (currentTimestamp - lastPostTimestamp.btc) > this.SIX_HOURS_IN_MS;
            const isMoreThan6HoursETH  = !lastPostTimestamp || (currentTimestamp - lastPostTimestamp.eth) > this.SIX_HOURS_IN_MS;
            const isMoreThan6HoursSOL  = !lastPostTimestamp || (currentTimestamp - lastPostTimestamp.sol) > this.SIX_HOURS_IN_MS;
            const bitcoinLast1hPost = await this.bitcoinController.get1hPricePost();
            const isMoreThanMinVariationBTC = Math.abs(bitcoinLast1hPost.priceChange1h) >= minVariation
            const etherLast1hPost = await this.etherController.get1hPricePost();
            const solanaLast1hPost = await this.solanaController.get1hPricePost();

            console.log('bitcoin change price:', Math.abs(bitcoinLast1hPost.priceChange1h));
            if (Math.abs(bitcoinLast1hPost.priceChange1h) >= minVariation) {
                await this.btcPriceAccount.postBlueSky(bitcoinLast1hPost);
                await this.cryptoPriceAccount.postBlueSky(bitcoinLast1hPost);
            }

            console.log('ethereum change price:', Math.abs(etherLast1hPost.priceChange1h));
            if (Math.abs(etherLast1hPost.priceChange1h) >= minVariation) {
                await this.etherPriceAccount.postBlueSky(etherLast1hPost);
                await this.cryptoPriceAccount.postBlueSky(etherLast1hPost);
            }

            console.log('solana change price:', Math.abs(solanaLast1hPost.priceChange1h));
            if (Math.abs(solanaLast1hPost.priceChange1h) >= minVariation) {
                await this.solPriceAccount.postBlueSky(solanaLast1hPost);
                await this.cryptoPriceAccount.postBlueSky(solanaLast1hPost);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // async postAllCryptos1h() {
    //     try {
    //         const bitcoinLast1hPost = await this.bitcoinController.get1hPricePost();
    //         await this.btcPriceAccount.postBlueSky(bitcoinLast1hPost);
    //         await this.cryptoPriceAccount.postBlueSky(bitcoinLast1hPost);
    //
    //         const etherLast1hPost = await this.etherController.get1hPricePost();
    //         await this.etherPriceAccount.postBlueSky(etherLast1hPost);
    //         await this.cryptoPriceAccount.postBlueSky(etherLast1hPost);
    //
    //         const solanaLast1hPost = await this.solanaController.get1hPricePost();
    //         await this.solPriceAccount.postBlueSky(solanaLast1hPost);
    //         await this.cryptoPriceAccount.postBlueSky(solanaLast1hPost);
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // }

    async postAllCryptos24h() {
        try {
            const bitcoinLast24hPost = await this.bitcoinController.get24hPost();
            await this.btcPriceAccount.postBlueSky(bitcoinLast24hPost);
            await this.cryptoPriceAccount.postBlueSky(bitcoinLast24hPost);

            const etherLast24hPost = await this.etherController.get24hPost();
            await this.etherPriceAccount.postBlueSky(etherLast24hPost);
            await this.cryptoPriceAccount.postBlueSky(etherLast24hPost);

            const solanaLast24hPost = await this.solanaController.get24hPost();
            await this.solPriceAccount.postBlueSky(solanaLast24hPost);
            await this.cryptoPriceAccount.postBlueSky(solanaLast24hPost);
        } catch (error) {
            console.error(error.message);
        }
    }

    // async postSingleCryptos24hIfVariation(minVariation: number) {
    //     try {
    //         const bitcoinLast24hPost = await this.bitcoinController.get24hPricePost();
    //         if (bitcoinLast24hPost.variation >= minVariation) {
    //             await this.btcPriceAccount.postBlueSky(bitcoinLast24hPost);
    //             await this.cryptoPriceAccount.postBlueSky(bitcoinLast24hPost);
    //         }
    //
    //         const etherLast24hPost = await this.etherController.get24hPricePost();
    //         if (etherLast24hPost.variation >= minVariation) {
    //             await this.etherPriceAccount.postBlueSky(etherLast24hPost);
    //             await this.cryptoPriceAccount.postBlueSky(etherLast24hPost);
    //         }
    //
    //         const solanaLast24hPost = await this.solanaController.get24hPricePost();
    //         if (solanaLast24hPost.variation >= minVariation) {
    //             await this.solPriceAccount.postBlueSky(solanaLast24hPost);
    //             await this.cryptoPriceAccount.postBlueSky(solanaLast24hPost);
    //         }
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // }


}

