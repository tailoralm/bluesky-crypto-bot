import CryptoController from "./crypto.controller";
import {Cache} from "node-ts-cache";
import {myCache} from "../../utils/cache.utils";

export default class EtherController extends CryptoController {
    constructor() {
        super('ethereum', 'usd', 'Ethereum');
    }

    @Cache(myCache, {ttl: 60})
    protected getCachedPriceData(){
        return super.getCachedPriceData();
    }
}

