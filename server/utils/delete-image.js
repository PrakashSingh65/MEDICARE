import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

export const DeleteImage = async (publicId) => {
  if (!publicId) return null;

  if (String(publicId).startsWith("local:")) {
    const filename = path.basename(String(publicId).slice("local:".length));
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.promises.unlink(filePath).catch(() => null);
    return { result: "ok" };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error.message);
      }
      return resolve(result);
    });
  });
};