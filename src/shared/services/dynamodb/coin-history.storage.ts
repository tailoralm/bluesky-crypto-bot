import { Cache } from "node-ts-cache";
import { DynamodbStorage } from './dynamodb.storage';
import { myCache } from "../../../shared/utils/cache.utils";

export class CoinHistoryStorage extends DynamodbStorage {
    constructor() {
        super('coin-history');
        this.createTable();
    }

    saveItem(data: ICoinPriceHistory): Promise<void> {
        return super.saveItem(data);
    }

    saveItems(data: ICoinPriceHistory[]): Promise<void> {
        return super.saveItems(data);
    }

    @Cache(myCache, {isCachedForever: true})
    async createTable(): Promise<void> {
        super.ensureTableExists({ AttributeName: 'symbol', AttributeType: 'S' }, { AttributeName: 'timestamp', AttributeType: 'N' });
    }
}

export interface ICoinPriceHistory {
    symbol: string;
    timestamp: number;
    usdprice?: number;
    marketcap?: number;
    totalvolume?: number;
    source: string;
}