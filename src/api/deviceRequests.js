import axios from "axios";
import ApiRoutes from "./apiRoutes";
import {loadState} from "../utils/localStorage";

export const telemetryRequest = async (params) => {
    return await axios.get(ApiRoutes.URL +
        `api/plugins/telemetry/DEVICE/${loadState('devId')}/values/timeseries?keys=${params.join(",")}&startTs=1685951580000&endTs=${new Date().getTime()}&limit=1`,
        {
            "headers": {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${loadState('devToken')}`
            }
        }
    ).then(r => r.data).catch(err => undefined)
}

export const deviceIdRequest = async () => {
    return await axios.get(ApiRoutes.URL + ApiRoutes.GET_CUSTOMER_DEVICES + "?pageSize=10&page=0",
        {
            "headers": {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${loadState('devToken')}`
            }
        }
    ).then(r => r.data.data).catch(err => undefined) //.data[0].id.id
}
