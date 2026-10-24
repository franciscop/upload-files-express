// Barebones smoke test, not a full suite
import { describe, expect, it } from "bun:test";
import upload from "./index.js";

describe("upload-files-express", () => {
  it("skips requests without a body", () => {
    let called = false;
    upload()({ method: "GET", headers: {} }, {}, () => (called = true));
    expect(called).toBe(true);
  });

  it("skips requests that are not multipart", () => {
    let called = false;
    const req = { method: "POST", headers: { "content-type": "application/json" } };
    upload()(req, {}, () => (called = true));
    expect(called).toBe(true);
  });
});
