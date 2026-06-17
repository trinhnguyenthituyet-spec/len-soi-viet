import ExcelJS from "exceljs";

export interface ParsedPriceRow {
  rowNumber: number;
  yarnName: string;
  sellerName: string;
  priceRaw: string;
}

export async function parseExcelBuffer(buffer: Buffer): Promise<ParsedPriceRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as never);
  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const rows: ParsedPriceRow[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // header

    const yarnName = String(row.getCell(2).value ?? "").trim();
    const sellerName = String(row.getCell(3).value ?? "").trim();
    const priceRaw = String(row.getCell(4).value ?? "").trim();

    if (!yarnName && !sellerName && !priceRaw) return; // skip blank row

    rows.push({ rowNumber, yarnName, sellerName, priceRaw });
  });

  return rows;
}

export async function generateTemplateBuffer(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Bảng giá");

  sheet.addRow(["STT", "Tên sợi", "Tên Shop", "Giá/100g"]);
  sheet.getRow(1).font = { bold: true };
  sheet.addRow([1, "Len Merino", "Craft Yarn VN", 85000]);
  sheet.addRow([2, "Len Merino", "Len Handmade HN", 90000]);
  sheet.addRow([3, "Cotton Cake", "Craft Yarn VN", 45000]);
  sheet.columns = [{ width: 6 }, { width: 24 }, { width: 24 }, { width: 14 }];

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
