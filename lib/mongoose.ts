//! this file just connects to the db
import mongoose from "mongoose";

let isConnected = false; // variable to track connection status

export const connectToDB = async () => {
  // set strict mode to avoid unknown queries
  mongoose.set('strictQuery', true);
  // check if URI exists
  if(!process.env.MONGODB_URI) return console.log(`MONGODB URI IS NOT DEFINED`);
  // check if connection exists
  if(isConnected) return console.log(`=> USING EXISTING DATABASE CONNECTION`);
  
  // attempt connection
  try {
    await mongoose.connect(process.env.MONGODB_URI);
     
    isConnected = true;
    
    console.log('MongoDB CONNECTED!');
  
  } catch (error) {
    console.log(error);
  }
}