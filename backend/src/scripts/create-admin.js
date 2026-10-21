import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Admin } from "../models/Admin.js";

function readHidden(prompt) {
  if (!stdin.isTTY) throw new Error("Run this command from an interactive terminal.");
  return new Promise((resolve, reject) => {
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
    };
    const onData = (key) => {
      if (key === "\u0003") {
        cleanup();
        reject(new Error("Cancelled."));
      } else if (key === "\r" || key === "\n") {
        cleanup();
        resolve(value);
      } else if (key === "\u007f" || key === "\b") {
        value = value.slice(0, -1);
      } else {
        value += key;
      }
    };
    stdin.on("data", onData);
  });
}

let exitCode = 0;
try {
  const terminal = readline.createInterface({ input: stdin, output: stdout });
  const email = (await terminal.question("Administrator email: ")).trim().toLowerCase();
  terminal.close();
  const password = await readHidden("Password (minimum 12 characters): ");
  const confirmation = await readHidden("Confirm password: ");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (password.length < 12 || password.length > 128) throw new Error("Password must be 12–128 characters.");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  await connectDatabase();
  const existing = await Admin.exists({ email });
  if (existing) throw new Error("An administrator with that email already exists.");
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash });
  console.info("Administrator account created.");
} catch (error) {
  console.error("Unable to create administrator:", error.message);
  exitCode = 1;
} finally {
  await mongoose.disconnect();
  process.exitCode = exitCode;
}
