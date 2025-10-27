import { describe, expect, test } from "vitest";

import { extractToken, normalizeUser } from "../auth.transforms";

describe("extractToken", () => {
  test("returns null for invalid payloads", () => {
    expect(extractToken(null)).toBeNull();
    expect(extractToken(undefined)).toBeNull();
    expect(extractToken(42)).toBeNull();
  });

  test("reads token from top-level field", () => {
    expect(extractToken({ token: "abc" })).toBe("abc");
    expect(extractToken({ access_token: "xyz" })).toBe("xyz");
  });

  test("reads token from nested data", () => {
    expect(extractToken({ data: { token: "nested" } })).toBe("nested");
    expect(extractToken({ data: { access_token: "inner" } })).toBe("inner");
  });
});

describe("normalizeUser", () => {
  test("raises when payload is invalid", () => {
    expect(() => normalizeUser(null)).toThrowError();
  });

  test("normalizes role names and attaches helpers", () => {
    const payload = {
      data: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        roles: [
          { id: 1, name: "Admin" },
          { id: 2, name: "Supervisor" },
        ],
      },
    };

    const result = normalizeUser(payload);
    expect(result.roles).toHaveLength(2);
    expect(result.roleNames).toEqual(["Admin", "Supervisor"]);
  });
});
