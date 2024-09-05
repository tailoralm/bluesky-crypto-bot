import CryptoController from "./crypto.controller";
import {Cache} from "node-ts-cache";
import {myCache} from "../../utils/cache.utils";

export default class SolanaController extends CryptoController {
    constructor() {
        super('solana', 'usd', 'Solana');
    }

    @Cache(myCache, {ttl: 60})
    protected getCachedPriceData(){
        return super.getCachedPriceData();
    }
}

