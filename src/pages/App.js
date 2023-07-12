import {Navigate} from "react-router";
import Cookies from "universal-cookie";
import {loadState} from "../utils/localStorage";

function App() {
    const cookies = new Cookies()

    if (loadState('devToken') && loadState('devId')){
        return <Navigate to="/devices" replace />
    } else {
        return <Navigate to="/login" replace />
    }
}

export default App;
