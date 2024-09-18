import CoingeckoService from "../../../../shared/services/coingecko/coingecko.service";
import CryptoMessageBuilder from "../crypto.message-builder";
import {getCurrentPrice, getPriceChange1h} from "../../../../shared/services/coingecko/coingecko.utils";
import {ICryptoGetPrice} from "../../../../shared/interfaces/cryptos.interface";
import { CoinHistoryStorage, ICoinPriceHistory } from "../../../../shared/services/dynamodb/coin-history.storage";
import { IMarketChart } from "../../../../shared/services/coingecko/coingecko.interface";

export default class CryptoController {
    protected coingeckoService: CoingeckoService;
    protected messageBuilder: CryptoMessageBuilder;
    protected coinHistoryStorage: CoinHistoryStorage;

    constructor(private coinId: string, currency: string) {
        this.coingeckoService = new CoingeckoService(coinId, currency);
        this.messageBuilder = new CryptoMessageBuilder(coinId);
        this.coinHistoryStorage = new CoinHistoryStorage();
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
        this.savePricesToDB(priceData);
        const postText = this.messageBuilder.create24hPriceUpdateSummary(priceData);
        return { postText };
    };

    savePricesToDB(data: IMarketChart): void {
        try {
            const formattedData: ICoinPriceHistory[] = [];        
            for (let i = 0; i < data.prices.length; i++) {
                formattedData.push({
                    symbol: this.coinId,
                    timestamp: data.prices[i][0],
                    usdprice: data.prices[i][1],
                    marketcap: data.market_caps[i][1],
                    totalvolume: data.total_volumes[i][1],
                    source: 'coingecko'
                });
            }

            this.coinHistoryStorage.saveItems(formattedData);
        } catch(e) {
            console.log('prices length:', data.prices.length);
            console.log('market_caps length:', data.market_caps.length);
            console.log('total_volumes length:', data.total_volumes.length);
            console.error(e);
        }
    }

}

