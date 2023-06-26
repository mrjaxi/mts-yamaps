import {Navigate} from "react-router";
import Cookies from "universal-cookie";

function App() {
    const cookies = new Cookies()

    if (cookies.get("devToken")){
        return <Navigate to="/devices" replace />
    } else {
        return <Navigate to="/login" replace />
    }
}

export default App;
