
import { NotificationInfo, setNotificationMessage, NotificationMessageType } from "../state/features/notification_slice"
import { store } from "../state/store"
import { msg } from "@lit/localize"


const fetchAuth = async (resource: RequestInfo | URL, options: RequestInit = {}) => {
    const response = await fetch(resource, options);
    if (response.status === 200){
        return response
    } else if (response.status === 401){ // Unauthorized
        // When trying to make an unauthorized call, redirect to logout
        window.location.href="/oauth/logout";
        throw new Error("Unauthorized")
    } else if (response.status === 403) { // Forbidden
        store.dispatch(setNotificationMessage(msg("You do not have the rights to access this content!"), NotificationMessageType.ERROR, 2500))
        throw new Error("Forbidden");
    } else {
        store.dispatch(setNotificationMessage(msg("Unable complete request!"), NotificationMessageType.ERROR, 2500))
        throw new Error("Unable to complete");
    }
}

export { fetchAuth }