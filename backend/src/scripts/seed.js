import { connectDatabase } from "../config/database.js";
import { ensureSampleContent } from "../utils/sample-content.js";
import mongoose from "mongoose";

try {
  await connectDatabase();
  await ensureSampleContent();
  console.info("Fictional sample events and sermons are ready.");
} catch (error) {
  console.error("Unable to seed sample content:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
