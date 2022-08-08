import dotenv from "dotenv";

import DatabaseInterface from "./DatabaseInterface";
import MongoDatabaseDriver from "./MongoDatabaseDriver";
dotenv.config();

let dbInstance: DatabaseInterface;

export default function getDatabaseConnection() {
  if (dbInstance) {
    return dbInstance;
  }

  if (process.env.MONGO_CONNECTION_STRING) {
    dbInstance = new MongoDatabaseDriver(
      process.env.MONGO_CONNECTION_STRING,
      process.env.MONGO_CERTICATE_FILE
    );
    return dbInstance;
  }

  throw new Error("There is no database driver");
}
