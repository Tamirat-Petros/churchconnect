import test, { after, before } from "node:test";
import assert from "node:assert/strict";

process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/churchconnect-test";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.JWT_SECRET = "test-only-secret-that-is-long-enough-for-validation";
process.env.NODE_ENV = "test";

const { app } = await import("../src/app.js");
let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("health endpoint reports an unavailable database", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { data: { status: "unavailable" } });
  assert.ok(response.headers.get("content-security-policy"));
});

test("admin endpoints reject unauthenticated requests", async () => {
  const response = await fetch(`${baseUrl}/api/admin/overview`);
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Authentication required." });
});

test("public form input is validated by the server", async () => {
  const response = await fetch(`${baseUrl}/api/public/prayer-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request: "too short" })
  });
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error, "Please check the submitted fields.");
  assert.ok(payload.details.request);
});

test("CORS rejects unapproved browser origins", async () => {
  const response = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://untrusted.example" } });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: "Origin is not allowed." });
});
