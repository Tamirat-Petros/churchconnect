import mongoose from "mongoose";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { ensureSampleContent } from "./utils/sample-content.js";

try {
  await connectDatabase();
  await ensureSampleContent();
  app.listen(env.PORT, () => console.info(`ChurchConnect API listening on port ${env.PORT}`));
} catch (error) {
  console.error("Server startup failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
}
