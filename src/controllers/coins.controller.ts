import BitcoinController from "./cryptos/bitcoin.controller";
import EtherController from "./cryptos/ether.controller";
import SolanaController from "./cryptos/solana.controller";
import BlueskyService from "../services/publishers/bluesky.service";

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

    constructor() {
        this.bitcoinController = new BitcoinController();
        this.etherController = new EtherController();
        this.solanaController = new SolanaController();
        this.btcPriceAccount = new BlueskyService(process.env.BLUESKY_BTC_USER, process.env.BLUESKY_BTC_PASSWORD);
        this.etherPriceAccount = new BlueskyService(process.env.BLUESKY_ETHER_USER, process.env.BLUESKY_ETHER_PASSWORD);
        this.solPriceAccount = new BlueskyService(process.env.BLUESKY_SOLANA_USER, process.env.BLUESKY_SOLANA_PASSWORD);
        this.cryptoPriceAccount = new BlueskyService(process.env.BLUESKY_CRYPTO_USER, process.env.BLUESKY_CRYPTO_PASSWORD);
    }

    async postAllCryptos1h() {
        try {
            const bitcoinLast1hPost = await this.bitcoinController.get1hPricePost();
            // await this.postBothBtc(bitcoinLast1hPost);

            const etherLast1hPost = await this.etherController.get1hPricePost();
            // await this.postBothEther(etherLast1hPost);

            const solanaLast1hPost = await this.solanaController.get1hPricePost();
            // await this.postBothSol(solanaLast1hPost);
            console.log(bitcoinLast1hPost)
            console.log(etherLast1hPost)
            console.log(solanaLast1hPost)
        } catch (error) {
            console.error(error.message);
        }
    }

    async postAllCryptos24h() {
        try {
            const bitcoinLast24hPost = await this.bitcoinController.get24hPricePost();
            // await this.postBothBtc(bitcoinLast24hPost);

            const etherLast24hPost = await this.etherController.get24hPricePost();
            // await this.postBothEther(etherLast24hPost);

            const solanaLast24hPost = await this.solanaController.get24hPricePost();
            // await this.postBothSol(solanaLast24hPost);
        } catch (error) {
            console.error(error.message);
        }
    }

    async postBothBtc(message: string){
        await this.btcPriceAccount.postBlueSky(message);
        await this.cryptoPriceAccount.postBlueSky(message);
    }

    async postBothEther(message: string){
        await this.etherPriceAccount.postBlueSky(message);
        await this.cryptoPriceAccount.postBlueSky(message);
    }

    async postBothSol(message: string){
        await this.solPriceAccount.postBlueSky(message);
        await this.cryptoPriceAccount.postBlueSky(message);
    }


}

