import { describe, expect, it } from "vitest";
import { validatePriceRow } from "./price-import";
import type { ParsedPriceRow } from "./excel-import";

function row(overrides: Partial<ParsedPriceRow>): ParsedPriceRow {
  return { rowNumber: 2, yarnName: "Len Merino", sellerName: "Craft Yarn VN", priceRaw: "85000", ...overrides };
}

describe("validatePriceRow", () => {
  it("accepts a well-formed row", () => {
    const result = validatePriceRow(row({}));
    expect(result).toEqual({
      valid: true,
      yarnName: "Len Merino",
      sellerName: "Craft Yarn VN",
      price: 85000,
    });
  });

  it("rejects a row missing the yarn name", () => {
    const result = validatePriceRow(row({ yarnName: "" }));
    expect(result).toEqual({ valid: false, reason: "Thiếu tên sợi hoặc tên shop" });
  });

  it("rejects a row missing the seller name", () => {
    const result = validatePriceRow(row({ sellerName: "  " }));
    expect(result.valid).toBe(false);
  });

  it("rejects a non-numeric price", () => {
    const result = validatePriceRow(row({ priceRaw: "không phải số" }));
    expect(result).toEqual({ valid: false, reason: 'Giá không hợp lệ: "không phải số"' });
  });

  it("rejects a zero price", () => {
    const result = validatePriceRow(row({ priceRaw: "0" }));
    expect(result.valid).toBe(false);
  });

  it("rejects a negative price", () => {
    const result = validatePriceRow(row({ priceRaw: "-50000" }));
    expect(result.valid).toBe(false);
  });

  it("rejects an empty price", () => {
    const result = validatePriceRow(row({ priceRaw: "" }));
    expect(result.valid).toBe(false);
  });

  it("trims whitespace from names before validating", () => {
    const result = validatePriceRow(row({ yarnName: "  Len Merino  ", sellerName: "  Craft Yarn VN  " }));
    expect(result).toMatchObject({ valid: true, yarnName: "Len Merino", sellerName: "Craft Yarn VN" });
  });
});
