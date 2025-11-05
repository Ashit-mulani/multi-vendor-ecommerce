import mongoose from "mongoose";

let backupConnection;

const ConnectBackupDB = async () => {
  if (backupConnection) return backupConnection;

  backupConnection = await mongoose.createConnection(
    process.env.BACKUP_DB_URL,
    {
      dbName: "backup-db",
    }
  );

  return backupConnection;
};

export default ConnectBackupDB;
