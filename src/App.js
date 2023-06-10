import {Navigate} from "react-router";
import Cookies from "universal-cookie";

function App() {
    const cookies = new Cookies()

    if (cookies.get("isLogin")){
        return <Navigate to="/main" replace />
    } else {
        return <Navigate to="/login" replace />
    }
}

export default App;
