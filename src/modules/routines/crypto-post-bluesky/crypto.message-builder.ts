import {
    getCurrentMarketCap,
    getCurrentPrice,
    getMarketCapChange24h,
    getPriceChange1h,
    getPriceChange24h,
    getTotalVolume,
    getTotalVolumeChange24h,
} from "../../../shared/services/coingecko/coingecko.utils";
import { formatDate } from "../../../shared/utils/format.utils";
import {IMarketChart} from "../../../shared/services/coingecko/coingecko.interface";

export default class CryptoMessageBuilder {
    constructor(private name: string) {}

    createCurrentPriceAnd1hChangeSummary(currentPrice: string, priceChange1h: string){
        return `#${this.name} is currently trading at:\n💰 ${currentPrice} (${priceChange1h}% in the last 1h)`;
    };

    createSection(date: Date) {
        return `#${this.name} 24h Update - ${formatDate(date)}\n\n`;
    }

    createPriceSection(data: IMarketChart) {
        const currentPrice = getCurrentPrice(data);
        const priceChange1h = getPriceChange1h(data);
        const priceChange24h = getPriceChange24h(data);
        return `💰 Current Price:\n${currentPrice} (1h: ${priceChange1h}%, 24h: ${priceChange24h}%)\n\n`;
    };

    createMarketCapSection(data: IMarketChart){
        const marketCap = getCurrentMarketCap(data);
        const marketCapChange24h = getMarketCapChange24h(data);
        return `💵 Market Cap:\n${marketCap} (24h Change: ${marketCapChange24h}%)\n\n`;
    };

    createVolumeSection(data: IMarketChart){
        const totalVolume = getTotalVolume(data);
        const volumeChange24h = getTotalVolumeChange24h(data);
        return `📊 Volume:\n${totalVolume} (24h Change: ${volumeChange24h}%)`;
    };

    create24hPriceUpdateSummary(data: IMarketChart){
        const today = new Date();
        const bitcoinSection = this.createSection(today);
        const priceSection = this.createPriceSection(data);
        const marketCapSection = this.createMarketCapSection(data);
        const volumeSection = this.createVolumeSection(data);

        return bitcoinSection + priceSection + marketCapSection + volumeSection;
    };

}