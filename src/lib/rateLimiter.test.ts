import { describe, expect, it } from "vitest";
import { throttleRequest } from "./rateLimiter";

describe("rateLimiter", () => {
  it("allows the first request and then blocks after limit", () => {
    const key = "test-key";
    for (let i = 1; i <= 10; i += 1) {
      const result = throttleRequest(key);
      expect(result.allowed).toBe(i < 11);
    }

    const blocked = throttleRequest(key);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
