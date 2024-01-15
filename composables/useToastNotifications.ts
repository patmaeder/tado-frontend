export const useToastNotifications = () => {
    let notifications = useState('toastNotifications', () => new Map());

    const showNotification = (notification: ToastNotification) => {
        const id = crypto.randomUUID();
        notifications.value.set(id, notification);

        if (notification.type == "BANNER") {
            setTimeout(() => {
                notifications.value.delete(id);
            }, notification.duration || 5000)
        }
    }

    const removeNotification = (id: String) => {
        notifications.value.delete(id);
    }

    return {
        notifications,
        removeNotification,
        showNotification,
    }
}