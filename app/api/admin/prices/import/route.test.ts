import ExcelJS from "exceljs";
import { NextRequest } from "next/server";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { POST } from "./route";

const PREFIX = "TEST_INTEGRATION_IMPORT_ROUTE_";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

async function makeExcelFile(rows: (string | number)[][], name = "test.xlsx"): Promise<File> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  rows.forEach((row) => sheet.addRow(row));
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return new File([arrayBuffer], name, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function makeRequest(file?: File): NextRequest {
  const formData = new FormData();
  if (file) formData.set("file", file);
  return new NextRequest("http://localhost/api/admin/prices/import", {
    method: "POST",
    body: formData,
  });
}

afterEach(async () => {
  await prisma.priceImportBatch.deleteMany({ where: { fileName: { contains: "test-import" } } });
  await prisma.yarnType.deleteMany({ where: { nameVi: { startsWith: PREFIX } } });
  await prisma.seller.deleteMany({ where: { name: { startsWith: PREFIX } } });
  vi.clearAllMocks();
});

describe("POST /api/admin/prices/import", () => {
  it("rejects unauthenticated requests with 401", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue(null);

    const file = await makeExcelFile([["STT", "Tên sợi", "Tên Shop", "Giá/100g"]]);
    const response = await POST(makeRequest(file));

    expect(response.status).toBe(401);
  });

  it("rejects requests with no file with 400", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue({ user: { email: "admin@example.com" } } as never);

    const response = await POST(makeRequest());

    expect(response.status).toBe(400);
  });

  it("processes a valid file end-to-end for an authenticated request", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue({ user: { email: "admin@example.com" } } as never);

    const file = await makeExcelFile(
      [
        ["STT", "Tên sợi", "Tên Shop", "Giá/100g"],
        [1, `${PREFIX}Len Merino`, `${PREFIX}Shop A`, 85000],
        [2, `${PREFIX}Len Merino`, "", "không phải số"],
      ],
      "test-import.xlsx",
    );

    const response = await POST(makeRequest(file));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.rowCount).toBe(2);
    expect(data.successCount).toBe(1);
    expect(data.errorCount).toBe(1);
    expect(data.newYarnCount).toBe(1);
    expect(data.newSellerCount).toBe(1);
    expect(data.newYarns[0].nameVi).toBe(`${PREFIX}Len Merino`);
  });
});
