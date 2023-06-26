import axios from "axios";
import AuthRoutes from "../AuthRoutes";
import {notifications} from "@mantine/notifications";

export const loadState = (key) => {

    try {
        const serializedState = localStorage.getItem(key);
        if(serializedState === null){
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (key, value) => {
    try{
        const serializedState = JSON.stringify(value);
        localStorage.setItem(key, serializedState);
    } catch (err){
        return undefined;
    }
}

export const removeState = (key) => {
    try {
        localStorage.removeItem(key)
    } catch (err) {
        return undefined
    }
}

export const geoDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3, pi = Math.PI;
    const { sin, cos, atan2 } = Math;

    const fi1 = lat1 * pi / 180, lamda1 = lon1 * pi / 180;
    const fi2 = lat2 * pi / 180, lamda2 = lon2 * pi / 180;
    const deltaFi = fi2 - fi1, deltaLamda = lamda2 - lamda1;

    const a = sin(deltaFi/2)**2 + cos(fi1) * cos(fi2) * sin(deltaLamda/2)**2;
    const c = 2 * atan2(a**.5, (1-a)**.5);
    const d = R * c;

    return d;
}

export const sendTelegramMessage = async (id, message) => {
    return await axios.get(
        AuthRoutes.TELEGRAM_SEND_MESSAGE + `?chat_id=${id}&text=${message}`)
        .then(r => r.data)
        .catch(err => {
            sendNotification("Ошибка!", "Невозможно отправить сообщение в телеграм")
        })
}

export const sendNotification = (title, message) => {
    notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: title,
        message: message,
        loading: false,
        color: 'red',
    })
}
