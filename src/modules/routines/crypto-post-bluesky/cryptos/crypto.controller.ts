import CoingeckoService from "../../../../shared/services/coingecko/coingecko.service";
import CryptoMessageBuilder from "../crypto.message-builder";
import * as CGUtils from "../../../../shared/utils/coingecko.utils";
import {ICryptoGetPrice} from "../../../../shared/interfaces/cryptos.interface";
import { CoinHistoryStorage, ICoinPriceHistory } from "../../../../shared/services/dynamodb/coin-history.storage";
import { IMarketChart } from "../../../../shared/interfaces/coingecko.interface";

export default class CryptoController {
    protected coingeckoService: CoingeckoService;
    protected messageBuilder: CryptoMessageBuilder;
    protected coinHistoryStorage: CoinHistoryStorage;

    constructor(private coinId: string, currency: string) {
        this.coingeckoService = new CoingeckoService(coinId, currency);
        this.messageBuilder = new CryptoMessageBuilder(coinId);
        this.coinHistoryStorage = new CoinHistoryStorage();
    }

    protected getCachedPriceData(days: number, precision: number) {
        return this.coingeckoService.fetchPriceData(days, precision);
    }

    async get1hPricePost(): Promise<ICryptoGetPrice> {
        const response = await this.getCachedPriceData(1, 2);
        const currentPrice = CGUtils.getCurrentPrice(response);
        const priceChange1h = CGUtils.getPriceChangeXPositions(response, 12);
        const postText = this.messageBuilder.createCurrentPriceAnd1hChangeSummary(currentPrice, priceChange1h);
        return { currentPrice, priceChange1h: Number(priceChange1h), postText };
    };

    async get24hPost(): Promise<ICryptoGetPrice> {
        const priceData = await this.getCachedPriceData(1, 2);
        const postText = this.messageBuilder.create24hPriceUpdateSummary(priceData);
        return { postText };
    };

    async get1WeekPost(): Promise<ICryptoGetPrice> {
        const priceData = await this.getCachedPriceData(7, 2);
        this.savePricesToDB(priceData);
        const postText = this.messageBuilder.create7dReportPriceUpdateSummary(priceData);
        return { postText };
    };

    private savePricesToDB(data: IMarketChart): void {
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

