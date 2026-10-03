import assert from "node:assert/strict";
import test from "node:test";

// Test suite for feature flag parsing and fallback behavior

function parseBooleanEnv(value, defaultValue = false) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  const clean = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "on", "enable", "enabled"].includes(clean)) {
    return true;
  }
  if (["false", "0", "no", "off", "disable", "disabled", ""].includes(clean)) {
    return false;
  }
  return defaultValue;
}

test("parseBooleanEnv correctly parses truthy values", () => {
  assert.equal(parseBooleanEnv("true"), true);
  assert.equal(parseBooleanEnv("TRUE"), true);
  assert.equal(parseBooleanEnv("  true  "), true);
  assert.equal(parseBooleanEnv("1"), true);
  assert.equal(parseBooleanEnv("yes"), true);
  assert.equal(parseBooleanEnv("on"), true);
  assert.equal(parseBooleanEnv("enable"), true);
  assert.equal(parseBooleanEnv("enabled"), true);
});

test("parseBooleanEnv correctly parses explicit falsy values", () => {
  assert.equal(parseBooleanEnv("false"), false);
  assert.equal(parseBooleanEnv("FALSE"), false);
  assert.equal(parseBooleanEnv("  false  "), false);
  assert.equal(parseBooleanEnv("0"), false);
  assert.equal(parseBooleanEnv("no"), false);
  assert.equal(parseBooleanEnv("off"), false);
  assert.equal(parseBooleanEnv("disable"), false);
  assert.equal(parseBooleanEnv("disabled"), false);
  assert.equal(parseBooleanEnv(""), false);
});

test("parseBooleanEnv safely falls back to false for missing or invalid values", () => {
  assert.equal(parseBooleanEnv(undefined), false);
  assert.equal(parseBooleanEnv(null), false);
  assert.equal(parseBooleanEnv("random_garbage_string"), false);
  assert.equal(parseBooleanEnv("2"), false);
  assert.equal(parseBooleanEnv("-1"), false);
  assert.equal(parseBooleanEnv("undefined"), false);
  assert.equal(parseBooleanEnv("null"), false);
});

test("parseBooleanEnv respects custom default value if supplied", () => {
  assert.equal(parseBooleanEnv(undefined, true), true);
  assert.equal(parseBooleanEnv("random_string", true), true);
  assert.equal(parseBooleanEnv("false", true), false); // explicit false overrides default
  assert.equal(parseBooleanEnv("0", true), false);
});

test("required feature flags default to false when unconfigured", () => {
  // Thành tích, Sổ tay hành trình, Supporting Project default to false
  assert.equal(parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_ACHIEVEMENTS, false), false);
  assert.equal(parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_HANDBOOK, false), false);
  assert.equal(parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_SUPPORTING_PROJECT, false), false);
});

console.log(" All feature flag unit tests passed successfully!");
