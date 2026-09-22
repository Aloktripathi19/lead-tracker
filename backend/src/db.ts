import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const useInMemory = process.env.USE_IN_MEMORY_DB === "true";

  let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lead-tracker";

  if (useInMemory) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mem = await MongoMemoryServer.create();
    uri = mem.getUri();
    console.log("Using in-memory MongoDB instance for this session");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
