import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      !apiSecret.includes("*") &&
      apiSecret !== "your_api_secret"
  );
};

const saveFileLocally = async (file, buffer, baseUrl) => {
  await fs.promises.mkdir(UPLOADS_DIR, { recursive: true });

  const originalExt = file.originalname ? path.extname(file.originalname) : "";
  const ext = originalExt || MIME_TO_EXT[file.mimetype] || ".png";
  const safeBaseName = (
    file.originalname ? path.basename(file.originalname, originalExt) : "avatar"
  )
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 40);

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}-${safeBaseName}${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  await fs.promises.writeFile(filePath, buffer);

  const resolvedBaseUrl = (
    baseUrl ||
    process.env.SERVER_URL ||
    `http://localhost:${process.env.PORT || 5000}`
  ).replace(/\/+$/, "");

  return {
    secure_url: `${resolvedBaseUrl}/uploads/${filename}`,
    public_id: `local:${filename}`,
  };
};

export const UploadImage = async (file, folder = "medicare-profile-images", baseUrl = "") => {
  const buffer = file?.buffer || file?.data;
  if (!file || !buffer) {
    throw new Error("No file buffer found");
  }

  if (isCloudinaryConfigured()) {
    try {
      const cloudResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: folder,
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              return resolve(result);
            }
          )
          .end(buffer);
      });
      if (cloudResult?.secure_url) {
        return cloudResult;
      }
    } catch (cloudError) {
      console.warn(
        "Cloudinary upload failed, falling back to local server storage:",
        cloudError?.message || cloudError
      );
    }
  }

  return saveFileLocally(file, buffer, baseUrl);
};