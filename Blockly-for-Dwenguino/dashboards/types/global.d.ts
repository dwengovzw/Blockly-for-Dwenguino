export {}


interface GlobalSettings {
    basepath:string,
    hostname:string,
    learningObjectAPIBasePath: string
}

declare global {
    var globalSettings: GlobalSettings
    let MathJax: any;
}


