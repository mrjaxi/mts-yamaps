import axios from "axios";
import AuthRoutes from "./AuthRoutes";

export const telegramRequest = async (id, message) => {
    return await axios.get(AuthRoutes.TELEGRAM_SEND_MESSAGE + `?chat_id=${id}&text=${message}`)
        .then(r => r.data)
        .catch(err => undefined)
}
