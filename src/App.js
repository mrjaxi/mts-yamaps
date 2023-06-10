import {Navigate} from "react-router";

function App() {
    if (global.isLogin){
        return <Navigate to="/main" replace />
    } else {
        return <Navigate to="/login" replace />
    }
}

export default App;
