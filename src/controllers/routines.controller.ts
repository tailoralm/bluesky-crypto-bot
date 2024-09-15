import * as schedule from "node-schedule";
import * as Log from "../utils/log.utils";
import {CRON} from "../utils/enums.utils";
import CoinsController from "./coins.controller";
export default class RoutinesController {
    private jobs: schedule.Job[] = [];
    private coinsController: CoinsController;
    constructor() {
        this.coinsController = new CoinsController();
    }

    init(){
        if(!process.env.IS_DEV) {
            console.log('Running for DEV');
            this.coinsController.postAllCryptos24h();
        } else {
            this.jobs.push(schedule.scheduleJob(CRON.EVERY_HOUR, () => {
                const now = new Date();
                Log.log('Running process');

                if (now.getHours() === 7 || now.getHours() === 19) {
                    this.coinsController.postAllCryptos24h();
                } else {
                    this.coinsController.postSingleCryptos1hIfVariation(1); 
                }
            }));
        }
    }

    cancelAll() {
        for (const job of this.jobs) {
            job.cancel();
        }
    }
}
