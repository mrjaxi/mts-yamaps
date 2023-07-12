import {notifications} from "@mantine/notifications";

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
