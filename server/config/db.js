import mongoose from "mongoose";

export const ConnectDB = async () => {
  const configuredUri = process.env.MONGO_URI?.trim();
  const fallbackUris = [
    "mongodb://host.docker.internal:27017/MEDICARE",
    "mongodb://127.0.0.1:27017/MEDICARE",
    "mongodb://localhost:27017/MEDICARE",
  ];

  const candidateUris = configuredUri
    ? [configuredUri, ...fallbackUris]
    : fallbackUris;

  const uniqueUris = [...new Set(candidateUris)];

  for (const uri of uniqueUris) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      const maskedUri = uri.includes("@")
        ? uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
        : uri;
      console.log(`MongoDB connected successfully (${maskedUri})`);
      return;
    } catch (err) {
      const masked = uri.includes("@")
        ? uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
        : uri;
      console.warn(`Connection attempt to ${masked} failed: ${err.message}`);
    }
  }

  console.error("All MongoDB connection attempts failed.");
  console.warn("Express server is running in offline/safe mode without database.");
};