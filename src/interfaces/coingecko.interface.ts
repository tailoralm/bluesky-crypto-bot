export interface IMarketChart {
    // first value is a timestamp, second is the price
    prices: number[][];
    market_caps: number[][];
    total_volumes: number[][];
}