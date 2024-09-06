import CryptoController from "./crypto.controller";

export default class EtherController extends CryptoController {
    constructor() {
        super('ethereum', 'usd', 'Ethereum');
    }
}

