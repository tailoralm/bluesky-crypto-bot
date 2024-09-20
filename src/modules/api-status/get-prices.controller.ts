
export default class GetPricesController {

    constructor(private currency: string) {

    }

    async getCurrentPrice() {
        return {
            currentPrice: 0,
            timestamp: 0
        }
    }


}