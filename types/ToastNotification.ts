type ToastNotification = {
    icon?: Component,
    title?: String,
    message: String,
    type: "BANNER" | "ALERT",
    duration?: number,
    status: "INFO" | "SUCCESS" | "WARNING" | "ERROR",
}