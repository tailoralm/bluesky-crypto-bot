import CryptoController from "./crypto.controller";

export default class BitcoinController extends CryptoController {
    constructor() {
        super('bitcoin', 'usd', 'Bitcoin');
    }
}

