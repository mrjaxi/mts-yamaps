import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {loadState} from "../utils/localStorage";

export const telemetryRequest = async (params) => {
    return await axios.get(AuthRoutes.URL +
        `api/plugins/telemetry/DEVICE/${loadState('devId')}/values/timeseries?keys=${params.join(",")}&startTs=1685951580000&endTs=${new Date().getTime()}&limit=1`,
        {
            "headers": {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${loadState('devToken')}`
            }
        }
    ).then(r => r.data).catch(err => undefined)
}
