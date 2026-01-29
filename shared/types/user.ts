export interface MinimalUserInfo {
    firstname: string,
    lastname: string,
    uuid: string,
    acceptedTerms: boolean
}

export interface MiniamLoggedInUserInfo extends MinimalUserInfo {
    loggedIn: boolean,
    platform: string,
    roles: string[]
}

export interface UserInfo extends MiniamLoggedInUserInfo{
    email: string,
    birthdate: string | null,
}

export const initialUserState: UserInfo = {
    loggedIn: false,
    firstname: "",
    lastname: "",
    email: "",
    platform: "unknown",
    birthdate: null,
    roles: [],
    uuid: "",
    acceptedTerms: false
}