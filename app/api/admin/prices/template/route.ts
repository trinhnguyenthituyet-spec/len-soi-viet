import { NextResponse } from "next/server";
import { generateTemplateBuffer } from "@/lib/excel-import";

export async function GET() {
  const buffer = await generateTemplateBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="bang-gia-mau.xlsx"',
    },
  });
}
