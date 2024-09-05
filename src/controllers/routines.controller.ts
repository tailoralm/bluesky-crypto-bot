import * as schedule from "node-schedule";
export default class RoutinesController {
    private jobs: schedule.Job[] = [];
    createRoutine(func: Function, cron: string) {
        this.jobs.push(schedule.scheduleJob(cron, () => {
            func();
        }));
    }

    cancelAll() {
        for (const job of this.jobs) {
            job.cancel();
        }
    }
}
