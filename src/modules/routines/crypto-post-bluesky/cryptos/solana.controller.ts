import CryptoController from "./crypto.controller";
import {Cache} from "node-ts-cache";
import {myCache} from "../../../../shared/utils/cache.utils";

export default class SolanaController extends CryptoController {
    constructor() {
        super('solana', 'usd');
    }

    @Cache(myCache, {ttl: 60})
    protected getCachedPriceData(days: number, precision: number) {
        return super.getCachedPriceData(days, precision);
    }
}
