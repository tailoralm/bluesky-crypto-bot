import * as schedule from "node-schedule";
import BitcoinController from "./bitcoin.controller";
import {CRON} from "../utils/enums.utils";
export default class RoutinesController {
    private jobs: schedule.Job[] = [];
    private bitcoinController: BitcoinController;
    constructor() {
        this.bitcoinController = new BitcoinController();
    }

    init(){
        this.bitcoinController.postBlueSkyBitcoin1hPriceUpdate();
        this.bitcoinController.postBlueSkyBitcoin24hPriceUpdate();
        this.jobs.push(schedule.scheduleJob(CRON.EVERY_MINUTE_59, () => {
            this.bitcoinController.postBlueSkyBitcoin1hPriceUpdate();
        }));
        this.jobs.push(schedule.scheduleJob(CRON.MINUTE_59_7H19H, () => {
            this.bitcoinController.postBlueSkyBitcoin24hPriceUpdate();
        }));
    }

    cancelAll() {
        for (const job of this.jobs) {
            job.cancel();
        }
    }
}
