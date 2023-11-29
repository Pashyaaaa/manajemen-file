import express from "express";
import {
  addFile,
  getFile,
  getFileById,
  deleteFile,
  downloadFile,
  editUrutan,
  updateToken,
} from "../controllers/FileController.js";
const router = express.Router();

router.get("/files", getFile);
router.get("/files/:id", getFileById);
router.get("/download/:hashedFilename", downloadFile);
router.post("/files", addFile);
router.put("/files/:id", editUrutan);
router.delete("/files/:id", deleteFile);
router.post("/update_token", updateToken);

export default router;
