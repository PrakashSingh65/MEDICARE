import cloudinary from "./cloudinary.js";

export const UploadImage = async (file, folder) => {
  // const buffer = await file.arrayBuffer();
  // const bytes = Buffer.from(buffer);

   if (!file || !file.buffer) {
    throw new Error('No file buffer found');
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        async (error, result) => {
          if (error) {
            return reject(error.message);
          }
          return resolve(result);
        }
      )
      .end(file.buffer);
  });
};