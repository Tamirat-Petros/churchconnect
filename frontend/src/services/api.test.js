import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./api.js";

afterEach(() => vi.unstubAllGlobals());

describe("api client", () => {
  it("includes credentials for cookie-based sessions", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { status: "ok" } }) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(api("/health")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith("/api/health", expect.objectContaining({ credentials: "include" }));
  });

  it("surfaces API error messages", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Please check the submitted fields." })
    }));
    await expect(api("/public/prayer-requests")).rejects.toThrow("Please check the submitted fields.");
  });

  it("explains when the API cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(api("/health")).rejects.toThrow("Unable to reach the ChurchConnect service.");
  });

  it("handles a non-JSON server failure explicitly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => { throw new SyntaxError("Unexpected token"); }
    }));
    await expect(api("/health")).rejects.toThrow("The ChurchConnect service is temporarily unavailable.");
  });
});
