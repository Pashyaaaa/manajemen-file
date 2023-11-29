import db from "../config/db.js";
import Files from "./FileModel.js";

const files = db.define("files", Files, {
  tableName: "files",
  timestamps: false,
  timezone: "+07:00",
});

db.sync();

export default db;
