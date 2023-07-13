import { html } from "lit";

let getGoogleMateriaIconsLinkTag = () => {
    return html`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />`;
}

let getGoogleMaterialIconsFilledLinkTag = () => {
    return html`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,700,1,0" />`;
}

// https://stackoverflow.com/questions/4371565/create-regexps-on-the-fly-using-string-variables
function escapeRegExp(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

interface LoadableState {
    loading?: boolean
}

export { getGoogleMateriaIconsLinkTag, LoadableState, escapeRegExp, getGoogleMaterialIconsFilledLinkTag }