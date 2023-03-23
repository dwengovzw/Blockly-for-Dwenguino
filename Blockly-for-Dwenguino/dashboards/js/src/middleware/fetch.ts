
import { NotificationInfo, setNotificationMessage, NotificationMessageType, doneLoading, loading } from "../state/features/notification_slice"
import { store } from "../state/store"
import { msg } from "@lit/localize"
import { logout } from "../state/features/user_slice"


const fetchAuth = async (resource: RequestInfo | URL, options: RequestInit = {}) => {
    const response = await fetch(resource, options);
    if (response.status === 200){   // OK
        return response
    } else if (response.status === 401){ // Unauthorized
        // When trying to make an unauthorized call, redirect to logout
        window.location.href="/oauth/logout";
        throw new Error("Unauthorized")
    } else if (response.status === 403) { // Forbidden
        store.dispatch(setNotificationMessage(msg("You do not have the rights to access this content!"), NotificationMessageType.ERROR, 2500))
        throw new Error("Forbidden");
    } else { // Other error
        store.dispatch(setNotificationMessage(msg("Unable complete request!"), NotificationMessageType.ERROR, 2500))
        throw new Error("Unable to complete");
    }
}

const createRequestMiddleware = (url: string, method: string, responseHandler: ((dispatch:any, getState:any, json: any) => void), body?: any, errorMessage?: string) => {
    return async (dispatch, getState) => {
        dispatch(loading())
        try {
            let request: RequestInit = {
                method: method,
                headers: { "Content-Type": "application/json"},
            }
            if ((method === "PUT" || method === "POST") && body) {
                request.body = JSON.stringify(body)
            }
            const response = await fetchAuth(url, request)
            let json = await response.json()
            responseHandler(dispatch, getState, json)
        } catch (err) {
            dispatch(setNotificationMessage(errorMessage ?? msg("Error completing request"), NotificationMessageType.ERROR, 2500))
        } finally {
            dispatch(doneLoading())
        }
    }
}

export { fetchAuth, createRequestMiddleware }