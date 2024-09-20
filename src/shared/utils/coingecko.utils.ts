import {
  calculatePercentageChange,
  formatCurrency,
} from "./format.utils";
import { IMarketChart} from "../interfaces/coingecko.interface";

export function getCurrentPrice(data: IMarketChart) {
  return formatCurrency(data.prices[data.prices.length - 1][1]);
};

export function getCurrentMarketCap(data: IMarketChart) {
  return formatCurrency(data.market_caps[data.market_caps.length - 1][1]);
};

export function getTotalVolume(data: IMarketChart) {
  return formatCurrency(data.total_volumes[data.total_volumes.length - 1][1]);
};

export function getPriceChangeXPositions(data: IMarketChart, positions: number) {
  const currentIndex = data.prices.length - 1;
  const positiontoGet = currentIndex - positions;
  return (
    calculatePercentageChange(
      data.prices[currentIndex][1],
      data.prices[positiontoGet][1]
    ).toFixed(2)
  );
};

export function getPriceChangeFirstAndLast(data: IMarketChart) {
  return (
    calculatePercentageChange(
      data.prices[data.prices.length - 1][1],
      data.prices[0][1]
    ).toFixed(2)
  );
};

export function getMarketCapChangeFirstAndLast(data: IMarketChart) {
  return (
    calculatePercentageChange(
      data.market_caps[data.market_caps.length - 1][1],
      data.market_caps[0][1]
    ).toFixed(2)
  );
};


export function getTotalVolumeChangeFirstAndLast(data: IMarketChart) {
  return (
    calculatePercentageChange(
      data.total_volumes[data.total_volumes.length - 1][1],
      data.total_volumes[0][1]
    ).toFixed(2)
  );
};
