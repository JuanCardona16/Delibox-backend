import mongoose from "mongoose"

export const connectToDatabaseMongoAtlas = async (MONGO_ATLAS_URL: string): Promise<typeof mongoose> => {
  try {
    
    if (!MONGO_ATLAS_URL) {
      console.error("MONGO_ATLAS_URL environment variable is required.")
      process.exit(1)
    }

    const connection = await mongoose.connect(MONGO_ATLAS_URL)
    console.log(`Successfully connected to MongoDB Atlas!`)

    return connection

  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error}`)
    process.exit(1)
  }
}

mongoose.connection.on("error", (err: unknown) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});