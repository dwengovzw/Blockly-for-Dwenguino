"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const role_model_js_1 = require("./models/role.model.js");
let __dirname = path_1.default.resolve();
console.log(`dirname: ${__dirname}`);
// Load environment variables
dotenv_1.default.config({ path: __dirname + '/backend/.env' }); // configure .env location
const server_js_1 = require("./server.js");
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const httpServer = http_1.default.createServer(server_js_1.app);
mongoose_1.default.Promise = global.Promise;
let dev_db_url = 'mongodb://localhost/dwenguinoblockly_test_users';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose_1.default.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    if (process.env.ERASE_DATABASE_ON_SYNC) {
        dropDb();
    }
    console.log("Successfully connected to the MongoDb database.");
    initDb();
    launch();
}).catch((err) => {
    console.log(`Error connecting to db: ${err}`);
    console.log(`Quiting...`);
});
let dropDb = () => {
    console.log("DROPPING DATABASE");
    mongoose_1.default.connection.dropDatabase();
};
let initDb = () => {
    // Add default roles 
    role_model_js_1.Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            let roleNames = ["student", "teacher", "admin"];
            roleNames.forEach((role) => {
                new role_model_js_1.Role({
                    name: role
                }).save((err) => {
                    if (err) {
                        console.log("Error", err);
                    }
                    else {
                        console.log(`Added ${role} role`);
                    }
                });
            });
        }
    });
};
let launch = () => {
    // Launch app to listen to specified port
    httpServer.listen(server_js_1.port, function () {
        console.log("Running HTTP server on port " + server_js_1.port);
    });
};
//# sourceMappingURL=index.cjs.map