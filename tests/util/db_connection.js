
import mongoose from "mongoose"

const connectDb = async () => {
    return mongoose.connect(process.env.TEST_DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false });
}

const dropDb = async () => {
    mongoose.connection.dropDatabase();
}

export { connectDb, dropDb }