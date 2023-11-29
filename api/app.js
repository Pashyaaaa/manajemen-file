import express from "express";
import router from "./routes/routes.js";
import db from "./config/db.js";
import cors from "cors";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
const PORT = 5000;
const app = express();

try {
  await db.authenticate();
  console.log("Database Connected");
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server Is Running in ${PORT}`);
});
