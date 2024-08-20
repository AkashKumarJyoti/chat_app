import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.MONGO_URL;

async function connectToMongo() {
    await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully"))
    .catch(err => console.log(err));
}
  
export default connectToMongo;