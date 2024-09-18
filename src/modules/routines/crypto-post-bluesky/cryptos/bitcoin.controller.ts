import CryptoController from "./crypto.controller";
import {Cache} from "node-ts-cache";
import {myCache} from "../../../../shared/utils/cache.utils";

export default class BitcoinController extends CryptoController {
    constructor() {
        super('bitcoin', 'usd');
    }
    
    @Cache(myCache, {ttl: 60})
    protected getCachedPriceData(){
        return super.getCachedPriceData();
    }
}

