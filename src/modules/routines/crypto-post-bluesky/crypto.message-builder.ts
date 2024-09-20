import * as CGUtils from "../../../shared/utils/coingecko.utils";
import { formatDate } from "../../../shared/utils/format.utils";
import {IMarketChart} from "../../../shared/interfaces/coingecko.interface";

export default class CryptoMessageBuilder {
    constructor(private name: string) {}

    createCurrentPriceAnd1hChangeSummary(currentPrice: string, priceChange1h: string){
        return `#${this.name} is currently trading at:\n💰 ${currentPrice} (${priceChange1h}% in the last 1h)`;
    };

    // This function assumes that the interval is 5m
    create24hPriceUpdateSummary(data: IMarketChart){
        const today = new Date();
        const currentPrice = CGUtils.getCurrentPrice(data);
        const priceChange1h = CGUtils.getPriceChangeXPositions(data, 12);
        const priceChange24h = CGUtils.getPriceChangeFirstAndLast(data);
        const marketCap = CGUtils.getCurrentMarketCap(data);
        const marketCapChange24h = CGUtils.getMarketCapChangeFirstAndLast(data);
        const totalVolume = CGUtils.getTotalVolume(data);
        const volumeChange24h = CGUtils.getTotalVolumeChangeFirstAndLast(data);

        const bitcoinSection = `#${this.name} 24h Report Update - ${formatDate(today)}\n\n`;
        const priceSection = `💰 Current Price:\n${currentPrice} (1h: ${priceChange1h}%, 24h: ${priceChange24h}%)\n\n`;
        const marketCapSection = `💵 Market Cap:\n${marketCap} (24h Change: ${marketCapChange24h}%)\n\n`;
        const volumeSection = `📊 Volume:\n${totalVolume} (24h Change: ${volumeChange24h}%)`;

        return bitcoinSection + priceSection + marketCapSection + volumeSection;
    };

    // This function assumes that the interval is 1h
    create7dReportPriceUpdateSummary(data: IMarketChart){
        const today = new Date();
        const currentPrice = CGUtils.getCurrentPrice(data);
        const priceChange1h = CGUtils.getPriceChangeXPositions(data, 1);
        const priceChange24h = CGUtils.getPriceChangeXPositions(data, 24);
        const priceChange7d = CGUtils.getPriceChangeFirstAndLast(data);
        const marketCap = CGUtils.getCurrentMarketCap(data);
        const marketCapChange24h = CGUtils.getMarketCapChangeFirstAndLast(data);
        const totalVolume = CGUtils.getTotalVolume(data);
        const volumeChange24h = CGUtils.getTotalVolumeChangeFirstAndLast(data);

        const bitcoinSection = `#${this.name} 7d Report Update - ${formatDate(today)}\n\n`;
        const priceSection = `💰 Current Price:\n${currentPrice} (1h: ${priceChange1h}%, 24h: ${priceChange24h}%, 7d: ${priceChange7d}%)\n\n`;
        const marketCapSection = `💵 Market Cap:\n${marketCap} (7d Change: ${marketCapChange24h}%)\n\n`;
        const volumeSection = `📊 Volume:\n${totalVolume} (7d Change: ${volumeChange24h}%)`;

        return bitcoinSection + priceSection + marketCapSection + volumeSection;
    };

}