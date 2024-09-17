import { DynamodbStorage } from './dynamodb.storage';

export class CoinPriceHistoryStorage extends DynamodbStorage {
    constructor() {
        super('coin-price-history');
    }

}

export interface ICoinPriceHistory {
    symbol: string;
    timestamp: number;
    price: number;
    source: string;
}