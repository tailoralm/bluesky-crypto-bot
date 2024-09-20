import * as schedule from "node-schedule";
import * as Log from "../../shared/utils/log.utils";
import {CRON, TIMER} from "../../shared/utils/enums.utils";
import CryptoPostBlueskyController from "./crypto-post-bluesky/crypto-post-bluesky.controller";
export default class RoutinesController {
    private jobs: schedule.Job[] = [];
    private cryptoPostBlueskyController: CryptoPostBlueskyController;
    constructor() {
        this.cryptoPostBlueskyController = new CryptoPostBlueskyController();
    }

    init(){
        Log.log('Creating jobs...');
        if(process.env.IS_DEV) {
            Log.log('Running for DEV');
            this.cryptoPostBlueskyController.postAllCryptos1Week();
        } else {
            this.jobs.push(schedule.scheduleJob(CRON.EVERY_HOUR, () => {
                const now = new Date();
                Log.log('Running process');

                if (now.getHours() === 7){
                    this.cryptoPostBlueskyController.postAllCryptos1Week();
                } else if (now.getHours() === 19) {
                    this.cryptoPostBlueskyController.postAllCryptos24h();
                } else {
                    this.cryptoPostBlueskyController.postSingleCryptos1hIfVariation(2, TIMER.SIX_HOURS_IN_MS); 
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
