import { MinimalUserInfo } from "./user_slice"

interface StudentTeamInfo {
    uuid?: string,
    students: MinimalUserInfo[],
    portfolio?: string // Toto change this to porfolioInfo reference
}


export { StudentTeamInfo }