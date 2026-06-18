import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { generateTemplateBuffer, parseExcelBuffer } from "./excel-import";

async function bufferFromRows(rows: (string | number)[][]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  rows.forEach((row) => sheet.addRow(row));
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

describe("parseExcelBuffer", () => {
  it("parses a well-formed file, skipping the header row", async () => {
    const buffer = await bufferFromRows([
      ["STT", "Tên sợi", "Tên Shop", "Giá/100g"],
      [1, "Len Merino", "Craft Yarn VN", 85000],
      [2, "Cotton Cake", "Craft Yarn VN", 45000],
    ]);

    const rows = await parseExcelBuffer(buffer);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      rowNumber: 2,
      yarnName: "Len Merino",
      sellerName: "Craft Yarn VN",
      priceRaw: "85000",
    });
    expect(rows[1].yarnName).toBe("Cotton Cake");
  });

  it("skips fully blank rows", async () => {
    const buffer = await bufferFromRows([
      ["STT", "Tên sợi", "Tên Shop", "Giá/100g"],
      [1, "Len Merino", "Craft Yarn VN", 85000],
      [],
      [3, "Cotton Cake", "Craft Yarn VN", 45000],
    ]);

    const rows = await parseExcelBuffer(buffer);

    expect(rows).toHaveLength(2);
  });

  it("keeps a row with a missing name field so validation downstream can reject it", async () => {
    const buffer = await bufferFromRows([
      ["STT", "Tên sợi", "Tên Shop", "Giá/100g"],
      [1, "", "Craft Yarn VN", 50000],
    ]);

    const rows = await parseExcelBuffer(buffer);

    expect(rows).toHaveLength(1);
    expect(rows[0].yarnName).toBe("");
    expect(rows[0].priceRaw).toBe("50000");
  });

  it("keeps a row with an invalid (non-numeric) price so validation downstream can reject it", async () => {
    const buffer = await bufferFromRows([
      ["STT", "Tên sợi", "Tên Shop", "Giá/100g"],
      [1, "Len Merino", "Craft Yarn VN", "không phải số"],
    ]);

    const rows = await parseExcelBuffer(buffer);

    expect(rows).toHaveLength(1);
    expect(rows[0].priceRaw).toBe("không phải số");
  });

  it("returns an empty array for a file with only a header row", async () => {
    const buffer = await bufferFromRows([["STT", "Tên sợi", "Tên Shop", "Giá/100g"]]);

    const rows = await parseExcelBuffer(buffer);

    expect(rows).toEqual([]);
  });

  it("returns an empty array for a completely empty sheet", async () => {
    const buffer = await bufferFromRows([]);

    const rows = await parseExcelBuffer(buffer);

    expect(rows).toEqual([]);
  });
});

describe("generateTemplateBuffer", () => {
  it("produces a file that parseExcelBuffer can read back with the expected example rows", async () => {
    const buffer = await generateTemplateBuffer();
    const rows = await parseExcelBuffer(buffer);

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ yarnName: "Len Merino", sellerName: "Craft Yarn VN", priceRaw: "85000" });
    expect(rows[2]).toMatchObject({ yarnName: "Cotton Cake", sellerName: "Craft Yarn VN", priceRaw: "45000" });
  });
});
