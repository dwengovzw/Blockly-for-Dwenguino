export {}


interface GlobalSettings {
    basepath:string,
    hostname:string
}

declare global {
    var globalSettings: GlobalSettings
}