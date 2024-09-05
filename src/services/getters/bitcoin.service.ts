import axios from "axios";

export default class BitcoinService {
  COIN_ID: string;
  CURRENCY: string;
  constructor() {
    this.COIN_ID = process.env['COIN_ID'];
    this.CURRENCY = process.env['CURRENCY'];
  }

  async fetchPriceData() {
    const endpoint = `${process.env.COINGECKO_API_URL}/coins/${this.COIN_ID}/market_chart`;
    try {
      const response = await axios.get(endpoint, {
        params: { vs_currency: this.CURRENCY, days: 1, precision: 2 },
      });
      return response.data;
    } catch (error) {
      return { message: "Error fetching price data", error: error };
    }
  };
}

