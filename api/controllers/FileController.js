import db from "../models/index.js";
const Files = db.models.files;
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import sqlite from "sqlite3";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.resolve(__dirname, "../token.db");

export const getFile = async (req, res) => {
  try {
    const response = await Files.findAll({
      order: [["urutan", "ASC"]], // Urutkan berdasarkan kolom 'urutan'
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getFileById = async (req, res) => {
  const fileId = req.params.id;

  try {
    // Lakukan pengambilan data dari database berdasarkan fileId
    const fileData = await Files.findByPk(fileId, {
      order: [["urutan", "ASC"]], // Urutkan berdasarkan kolom 'urutan'
    });

    if (!fileData) {
      // Jika data tidak ditemukan, kirim respons 404 Not Found
      return res.status(404).json({ error: "File not found" });
    }

    // Kirim respons dengan data yang ditemukan
    res.json(fileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addFile = async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ message: "No File Uploaded" });
  }

  const file = req.files.file;
  const urutan = req.body.urutan;

  // Membuat nama file yang unik dengan menambahkan UUID ke nama asli file
  const uniqueFileName = `${uuidv4()}_${file.name}`;
  file.mv(`./public/file/${uniqueFileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      await Files.create({
        nama_file: file.name,
        file: uniqueFileName,
        urutan: urutan,
      });

      res.status(201).json({ message: "Produk Telah ditambahkan" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const deleteFile = async (req, res) => {
  const file = await Files.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!file) {
    return res.status(404).json({ message: "No Data Found" });
  }
  try {
    const filepath = `./public/file/${file.file}`;
    fs.unlinkSync(filepath);
    await Files.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({ message: "File Telah dihapus" });
  } catch (error) {
    console.log(error);
  }
};

export const editUrutan = async (req, res) => {
  const fileId = req.params.id;
  const newUrutan = req.body.urutan;

  try {
    const fileToUpdate = await Files.findByPk(fileId);

    if (!fileToUpdate) {
      return res.status(404).json({ error: "File not found" });
    }

    // Update urutan berkas
    await fileToUpdate.update({ urutan: newUrutan });

    res.json({ success: true, message: "Urutan updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const downloadFile = async (req, res) => {
  const hashedFilename = req.params.hashedFilename;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, "..", "public", "file", hashedFilename);
  res.download(filePath);
};

export const updateToken = async (req, res) => {
  const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.log(err);
  });

  try {
    const { token } = req.body;
    const sql = "UPDATE token SET token = ? WHERE id = 1";

    db.run(sql, [token], (err) => {
      if (err) throw err;

      res
        .status(200)
        .json({ success: true, message: `Berhasil, token: ${token}` });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  } finally {
    db.close((err) => {
      if (err) console.error(err.message);
    });
  }
};
