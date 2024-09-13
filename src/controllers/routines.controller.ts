import * as schedule from "node-schedule";
import {CRON} from "../utils/enums.utils";
import CoinsController from "./coins.controller";
export default class RoutinesController {
    private jobs: schedule.Job[] = [];
    private coinsController: CoinsController;
    constructor() {
        this.coinsController = new CoinsController();
    }

    init(){
        this.coinsController.postSingleCryptos1hIfVariation(1);
        this.jobs.push(schedule.scheduleJob(CRON.EVERY_MINUTE_35, () => {
            this.coinsController.postSingleCryptos1hIfVariation(1);
        }));

        this.jobs.push(schedule.scheduleJob(CRON.MINUTE_59_7H19H, () => {
            this.coinsController.postAllCryptos24h();
        }));
    }

    cancelAll() {
        for (const job of this.jobs) {
            job.cancel();
        }
    }
}
