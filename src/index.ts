import * as dotenv from "dotenv";
import RoutinesController from "./modules/routines/routines.controller";

try {
    dotenv.config();
    const routines = new RoutinesController();
    routines.init();

} catch (e) {
    console.error(e);
}
