import { describe, expect, it } from "vitest";
import { isNonEmptyString, validateEmail, validatePassword, validatePhone, validatePortal, validateItemType, validateItemId, isAdminLoginCredentials, isAdminPortal, isTravellerTestLoginCredentials } from "./validators";

describe("validators", () => {
  it("validates non-empty strings", () => {
    expect(isNonEmptyString("hello")).toBe(true);
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
  });

  it("validates email addresses", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid@" )).toBe(false);
    expect(validateEmail("")).toBe(false);
  });

  it("validates password length", () => {
    expect(validatePassword("abcdefgh")).toBe(true);
    expect(validatePassword("short")).toBe(false);
  });

  it("validates phone format", () => {
    expect(validatePhone("+91 99999 99999")).toBe(true);
    expect(validatePhone("123" )).toBe(false);
  });

  it("validates allowed portals", () => {
    expect(validatePortal("traveler")).toBe(true);
    expect(validatePortal("hotel-partner")).toBe(true);
    expect(validatePortal("unknown")).toBe(false);
  });

  it("recognizes the hardcoded admin credentials and admin portal", () => {
    expect(isAdminLoginCredentials("testadmin@gmail.com", "hello123@#")).toBe(true);
    expect(isAdminLoginCredentials("testadmin@gmail.com", "wrong-password")).toBe(false);
    expect(isAdminPortal("admin")).toBe(true);
    expect(isAdminPortal("traveler")).toBe(false);
  });

  it("recognizes the traveller test login credentials", () => {
    expect(isTravellerTestLoginCredentials("test@gmail.com", "hello123@#")).toBe(true);
    expect(isTravellerTestLoginCredentials("test@gmail.com", "wrong-password")).toBe(false);
  });

  it("validates allowed item types", () => {
    expect(validateItemType("flight")).toBe(true);
    expect(validateItemType("unknown")).toBe(false);
  });

  it("validates item IDs", () => {
    expect(validateItemId("item123")).toBe(true);
    expect(validateItemId("")).toBe(false);
  });
});
