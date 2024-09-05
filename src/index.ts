import * as dotenv from "dotenv";
import RoutinesController from "./controllers/routines.controller";
import BitcoinController from "./controllers/bitcoin.controller";
import {CRON} from "./utils/enums.utils";

try {
    dotenv.config();
    const bitcoinController = new BitcoinController();
    const routines = new RoutinesController();

    routines.createRoutine(bitcoinController.postBlueSkyBitcoin1hPriceUpdate, CRON.EVERY_MINUTE_59);
    routines.createRoutine(bitcoinController.postBlueSkyBitcoin24hPriceUpdate, CRON.MINUTE_59_7H19H);

} catch (e) {
    console.error(e);
}
