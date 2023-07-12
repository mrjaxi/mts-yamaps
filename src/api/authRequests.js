import axios from "axios";
import ApiRoutes from "./apiRoutes";

export const loginRequest = async (email, password) => {
    return await axios.post(ApiRoutes.URL + ApiRoutes.AUTH_PATH,
        {
            username: email,
            password: password
        }
    ).then(r => r.data.token).catch(err => undefined)
}
