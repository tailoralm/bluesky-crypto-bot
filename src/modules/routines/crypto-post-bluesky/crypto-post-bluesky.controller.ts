import BitcoinController from "./cryptos/bitcoin.controller";
import EtherController from "./cryptos/ether.controller";
import SolanaController from "./cryptos/solana.controller";
import BlueskyService from "../../../shared/services/bluesky/bluesky.service";
import {ITimePost, myCache} from "../../../shared/utils/cache.utils";

export default class CryptoPostBlueskyController {
    // Create Posts
    bitcoinController: BitcoinController;
    etherController: EtherController;
    solanaController: SolanaController;

    // Accoutns services
    btcPriceAccount: BlueskyService;
    etherPriceAccount: BlueskyService;
    solPriceAccount: BlueskyService;
    cryptoPriceAccount: BlueskyService;

    constructor() {
        this.bitcoinController = new BitcoinController();
        this.etherController = new EtherController();
        this.solanaController = new SolanaController();
        this.btcPriceAccount = new BlueskyService(process.env.BLUESKY_BTC_USER, process.env.BLUESKY_BTC_PASSWORD);
        this.etherPriceAccount = new BlueskyService(process.env.BLUESKY_ETHER_USER, process.env.BLUESKY_ETHER_PASSWORD);
        this.solPriceAccount = new BlueskyService(process.env.BLUESKY_SOLANA_USER, process.env.BLUESKY_SOLANA_PASSWORD);
        this.cryptoPriceAccount = new BlueskyService(process.env.BLUESKY_CRYPTO_USER, process.env.BLUESKY_CRYPTO_PASSWORD);
    }

    async postSingleCryptos1hIfVariation(minVariation: number, minTimestamp: number) {
        try {
            console.log('minVariation:', minVariation);
            const currentTimestamp = Date.now();
            const lastPostTimestamp: ITimePost = JSON.parse(await myCache.getItem('lastPostTimestamp') || '{}');
            
            const bitcoinLast1hPost = await this.bitcoinController.get1hPricePost();
            console.log('bitcoin change price:', Math.abs(bitcoinLast1hPost.priceChange1h));
            if(Math.abs(bitcoinLast1hPost.priceChange1h) >= minVariation) {
                await this.btcPriceAccount.postBlueSky(bitcoinLast1hPost);
                await this.cryptoPriceAccount.postBlueSky(bitcoinLast1hPost);
            } else if (!lastPostTimestamp.btc || (currentTimestamp - lastPostTimestamp.btc) > minTimestamp) {
                await this.btcPriceAccount.postBlueSky(bitcoinLast1hPost);
                lastPostTimestamp.btc = currentTimestamp;
            }
            
            const etherLast1hPost = await this.etherController.get1hPricePost();
            console.log('ethereum change price:', Math.abs(etherLast1hPost.priceChange1h));
            if (Math.abs(etherLast1hPost.priceChange1h) >= minVariation) {
                await this.etherPriceAccount.postBlueSky(etherLast1hPost);
                await this.cryptoPriceAccount.postBlueSky(etherLast1hPost);
            } else if (!lastPostTimestamp.eth || (currentTimestamp - lastPostTimestamp.eth) > minTimestamp) {
                await this.etherPriceAccount.postBlueSky(etherLast1hPost);
                lastPostTimestamp.eth = currentTimestamp;
            }
            
            const solanaLast1hPost = await this.solanaController.get1hPricePost();
            console.log('solana change price:', Math.abs(solanaLast1hPost.priceChange1h));
            if (Math.abs(solanaLast1hPost.priceChange1h) >= minVariation) {
                await this.solPriceAccount.postBlueSky(solanaLast1hPost);
                await this.cryptoPriceAccount.postBlueSky(solanaLast1hPost);
            } else if(!lastPostTimestamp.sol || (currentTimestamp - lastPostTimestamp.sol) > minTimestamp) {
                await this.solPriceAccount.postBlueSky(solanaLast1hPost);
                lastPostTimestamp.sol = currentTimestamp;
            }

            await myCache.setItem('lastPostTimestamp', JSON.stringify(lastPostTimestamp), { ttl: minTimestamp});
        } catch (error) {
            console.error(error.message);
        }
    }

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

    async postAllCryptos1Week() {
        try {
            const bitcoinLast7dPost = await this.bitcoinController.get1WeekPost();
            await this.btcPriceAccount.postBlueSky(bitcoinLast7dPost);
            await this.cryptoPriceAccount.postBlueSky(bitcoinLast7dPost);

            const etherLast7dPost = await this.etherController.get1WeekPost();
            await this.etherPriceAccount.postBlueSky(etherLast7dPost);
            await this.cryptoPriceAccount.postBlueSky(etherLast7dPost);

            const solanaLast7dPost = await this.solanaController.get1WeekPost();
            await this.solPriceAccount.postBlueSky(solanaLast7dPost);
            await this.cryptoPriceAccount.postBlueSky(solanaLast7dPost);
        } catch (error) {
            console.error(error.message);
        }
    }

}

