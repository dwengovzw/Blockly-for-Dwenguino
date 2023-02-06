
import { setNotification, NotificationInfo } from "../state/features/notification_slice"
import { store } from "../state/store"
import { msg } from "@lit/localize"
import { logout, loadFailed } from "../state/features/user_slice"


const fetchAuth = async (resource: RequestInfo | URL, options: RequestInit = {}) => {
    const response = await fetch(resource, options);
    if (response.status === 200){
        return response
    } else if (response.status === 401){ // Unauthorized
        // When trying to make an unauthorized call, redirect to logout
        window.location.href="/oauth/logout";
        throw new Error("Unauthorized")
    } else if (response.status === 403) { // Forbidden
        let notification: NotificationInfo = {
            message: msg("You do not have the rights to access this content!"),
            class: "error",
            time: 2500
        }
        store.dispatch(setNotification(notification))
        throw new Error("Forbidden");
    } else {
        let notification: NotificationInfo = {
            message: msg("Unable complete request!"),
            class: "error",
            time: 2500
        }
        store.dispatch(setNotification(notification))
        throw new Error("Unable to complete");
    }
}

export { fetchAuth }