import {Navigate} from "react-router";
import {loadState} from "../utils/localStorage";

function App() {
    if (loadState('devToken')){
        return <Navigate to="/devices" replace />
    } else {
        return <Navigate to="/login" replace />
    }
}

export default App;
