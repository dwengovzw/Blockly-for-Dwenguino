import db from "../../shared/constants/db.config.shared.js"

// only support test platform in dev mode
if (process.env.NODE_ENV == "development"){
    console.log("Adding test platform to db config for development")
    db.PLATFORMS["test"] = "test"
}


export default db