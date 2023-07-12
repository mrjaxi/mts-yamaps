import axios from "axios";
import ApiRoutes from "./apiRoutes";

export const telegramApiRequests = async (id, message) => {
    return await axios.get(ApiRoutes.TELEGRAM_SEND_MESSAGE + `?chat_id=${id}&text=${message}`)
        .then(r => r.data)
        .catch(err => undefined)
}
