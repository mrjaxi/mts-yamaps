import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {MantineProvider} from '@mantine/core';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "./LoginForm";
import MainMap from "./MainMap";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/main" element={<MainMap />} />
            </Routes>
        </BrowserRouter>
    </MantineProvider>
);
