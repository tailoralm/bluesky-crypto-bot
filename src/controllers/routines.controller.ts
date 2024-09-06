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
        this.coinsController.postAllCryptos1h();
        this.jobs.push(schedule.scheduleJob(CRON.EVERY_MINUTE_59, () => {
            this.coinsController.postAllCryptos1h();
        }));

        this.coinsController.postAllCryptos24h();
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
