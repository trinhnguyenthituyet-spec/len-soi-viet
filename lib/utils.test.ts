import { describe, expect, it } from "vitest";
import { formatVnd, isPriceStale, slugify } from "./utils";

describe("slugify", () => {
  it("converts Vietnamese diacritics to ASCII", () => {
    expect(slugify("Len Merino")).toBe("len-merino");
    expect(slugify("Đan móc - Áo sweater mùa đông")).toBe("dan-moc-ao-sweater-mua-dong");
    expect(slugify("Cotton Cake 100%")).toBe("cotton-cake-100");
  });

  it("collapses whitespace and trims", () => {
    expect(slugify("  Nhiều   khoảng   trắng  ")).toBe("nhieu-khoang-trang");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("strips punctuation that has no ASCII equivalent", () => {
    expect(slugify("Sợi 50g/cuộn (giá tốt!)")).toBe("soi-50gcuon-gia-tot");
  });
});

describe("formatVnd", () => {
  it("formats positive amounts with VND currency and no decimals", () => {
    const result = formatVnd(85000);
    expect(result).toContain("85.000");
    expect(result).toContain("₫");
  });

  it("formats zero", () => {
    const result = formatVnd(0);
    expect(result).toContain("0");
  });
});

describe("isPriceStale", () => {
  it("returns false for a date verified today", () => {
    expect(isPriceStale(new Date())).toBe(false);
  });

  it("returns false for a date verified 13 days ago (under the 14-day threshold)", () => {
    const date = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
    expect(isPriceStale(date)).toBe(false);
  });

  it("returns true for a date verified 15 days ago (over the 14-day threshold)", () => {
    const date = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    expect(isPriceStale(date)).toBe(true);
  });

  it("respects a custom staleDays threshold", () => {
    const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    expect(isPriceStale(date, 3)).toBe(true);
    expect(isPriceStale(date, 7)).toBe(false);
  });
});
