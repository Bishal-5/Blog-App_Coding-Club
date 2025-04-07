import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const DB = async () => {
    try {
        mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log('MONGODB IS CONNECTED')
    } catch (error) {
        console.log(error)
    }
}

export default DB;