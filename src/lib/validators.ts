const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-() ]{7,25}$/;
const ALLOWED_PORTALS = ["traveler", "hotel-partner", "corporate", "travel-agent", "admin"] as const;
const ALLOWED_ITEM_TYPES = ["hotel", "room", "flight", "package", "train", "activity", "visa"] as const;

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

export function validatePassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8;
}

export function validatePortal(value: unknown): value is (typeof ALLOWED_PORTALS)[number] {
  return typeof value === "string" && ALLOWED_PORTALS.includes(value as any);
}

export function validatePhone(value: unknown): value is string {
  return typeof value === "string" && PHONE_REGEX.test(value.trim());
}

export function validateItemType(value: unknown): value is (typeof ALLOWED_ITEM_TYPES)[number] {
  return typeof value === "string" && ALLOWED_ITEM_TYPES.includes(value as any);
}

export function validateItemId(value: unknown): value is string {
  return isNonEmptyString(value) && value.trim().length <= 128;
}
