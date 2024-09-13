import {
  calculatePercentageChange,
  formatCurrency,
} from "./format.utils";
import {IMarketChart} from "../interfaces/coingecko.interface";

export const getCurrentPrice = (data: IMarketChart) => {
  return formatCurrency(data.prices[data.prices.length - 1][1]);
};

export const getPriceChange1h = (data: IMarketChart) => {
  const currentIndex = data.prices.length - 1;
  const oneHourAgoIndex = currentIndex - 12;
  return (
    calculatePercentageChange(
      data.prices[currentIndex][1],
      data.prices[oneHourAgoIndex][1]
    ).toFixed(2)
  );
};

export const getPriceChange24h = (data: IMarketChart) => {
  return (
    calculatePercentageChange(
      data.prices[data.prices.length - 1][1],
      data.prices[0][1]
    ).toFixed(2)
  );
};

export const getCurrentMarketCap = (data: IMarketChart) => {
  return formatCurrency(data.market_caps[data.market_caps.length - 1][1]);
};

export const getMarketCapChange24h = (data: IMarketChart) => {
  return (
    calculatePercentageChange(
      data.market_caps[data.market_caps.length - 1][1],
      data.market_caps[0][1]
    ).toFixed(2)
  );
};

export const getTotalVolume = (data: IMarketChart) => {
  return formatCurrency(data.total_volumes[data.total_volumes.length - 1][1]);
};

export const getTotalVolumeChange24h = (data: IMarketChart) => {
  return (
    calculatePercentageChange(
      data.total_volumes[data.total_volumes.length - 1][1],
      data.total_volumes[0][1]
    ).toFixed(2)
  );
};