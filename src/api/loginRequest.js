import axios from "axios";
import AuthRoutes from "./AuthRoutes";

export const loginRequest = async (email, password) => {
    return await axios.post(AuthRoutes.URL + AuthRoutes.AUTH_PATH,
        {
            username: email,
            password: password
        }
    ).then(r => r.data.token).catch(err => undefined)
}
