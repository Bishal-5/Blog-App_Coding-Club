import mongoose from "mongoose";


const DB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log('MONGODB IS CONNECTED')
    } catch (error) {
        console.log(error)
    }
}

export default DB;