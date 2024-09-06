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
        this.bitcoinController.postBitcoin1hPrice();
        this.bitcoinController.postBitcoin24hPrice();
        this.jobs.push(schedule.scheduleJob(CRON.EVERY_MINUTE_59, () => {
            this.bitcoinController.postBitcoin1hPrice();
        }));
        this.jobs.push(schedule.scheduleJob(CRON.MINUTE_59_7H19H, () => {
            this.bitcoinController.postBitcoin24hPrice();
        }));
    }

    cancelAll() {
        for (const job of this.jobs) {
            job.cancel();
        }
    }
}
