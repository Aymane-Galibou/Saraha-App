import mongoose from "mongoose";

async function ConnectToDataBase() {
  try {
    await mongoose.connect(process.env.URI_CONNECTION_ONLINE);
    console.log("connection to database etablished successfuly");
  } catch (error) {
    console.log("fail to connect to DB");
  }
}

export default ConnectToDataBase;
