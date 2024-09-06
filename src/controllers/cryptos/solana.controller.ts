import CryptoController from "./crypto.controller";

export default class SolanaController extends CryptoController {
    constructor() {
        super('solana', 'usd', 'Solana');
    }
}

