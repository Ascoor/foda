import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { TOKEN_STORAGE_KEY, clearStoredToken, getStoredToken, setStoredToken } from "../token-storage";

const getStorage = () => window.localStorage;

describe("token storage", () => {
  beforeEach(() => {
    getStorage().clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("reads and writes tokens", () => {
    expect(getStoredToken()).toBeNull();
    setStoredToken("abc");
    expect(getStoredToken()).toBe("abc");
    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });

  test("swallows storage errors in development", () => {
    const setItem = vi.spyOn(window.localStorage, "setItem");
    setItem.mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => setStoredToken("xyz")).not.toThrow();
  });
});
