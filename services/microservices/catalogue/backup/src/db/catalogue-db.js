import mongoose from "mongoose";

let mainConnection;

const ConnectMainDB = async () => {
  if (mainConnection) return mainConnection;

  mainConnection = await mongoose.createConnection(
    process.env.CATALOGUE_DB_URL,
    {
      dbName: "main-db",
    }
  );

  return mainConnection;
};

export default ConnectMainDB;
