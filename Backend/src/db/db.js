import { config } from "dotenv";
import mongoose from "mongoose";
import 'dotenv/config';

async function connectDB(){
    try{

        mongoose.connection.on('connected' , ()=>{
            console.log("Database connected");
        })
        await mongoose.connect(`${process.env.MONGO_URI}/chat-app`);

    }catch(e){
        console.error(e);
    }
}

export default connectDB;