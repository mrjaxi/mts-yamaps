import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './pages/App';
import {MantineProvider} from '@mantine/core';
import {HashRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainMap from "./pages/MainMap";
import {Notifications} from "@mantine/notifications";
import DevicesPage from "./pages/DevicesPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider>
        <Notifications position="top-right"/>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main" element={<MainMap />} />
                <Route path="/devices" element={<DevicesPage />} />
            </Routes>
        </HashRouter>
    </MantineProvider>
);
