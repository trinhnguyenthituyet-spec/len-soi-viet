import { NextRequest } from "next/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { GET } from "./route";

const PREFIX = "TEST_INTEGRATION_YARN_ROUTE_";

beforeAll(async () => {
  await prisma.yarnType.create({
    data: {
      slug: slugify(`${PREFIX}Len Merino`),
      nameVi: `${PREFIX}Len Merino`,
      fiberCategory: "animal",
    },
  });
  await prisma.yarnType.create({
    data: {
      slug: slugify(`${PREFIX}Cotton Cake`),
      nameVi: `${PREFIX}Cotton Cake`,
      fiberCategory: "plant",
    },
  });
});

afterAll(async () => {
  await prisma.yarnType.deleteMany({ where: { nameVi: { startsWith: PREFIX } } });
});

describe("GET /api/yarn", () => {
  it("returns yarns matching a search query", async () => {
    const request = new NextRequest(
      `http://localhost/api/yarn?search=${encodeURIComponent(`${PREFIX}Len Merino`)}`,
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].nameVi).toBe(`${PREFIX}Len Merino`);
  });

  it("filters by fiberCategory", async () => {
    const request = new NextRequest(
      `http://localhost/api/yarn?search=${encodeURIComponent(PREFIX)}&fiberCategory=plant`,
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data.items).toHaveLength(1);
    expect(data.items[0].nameVi).toBe(`${PREFIX}Cotton Cake`);
  });

  it("returns an empty list for a query matching nothing", async () => {
    const request = new NextRequest(
      `http://localhost/api/yarn?search=${encodeURIComponent(`${PREFIX}KhongTonTai`)}`,
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data.items).toEqual([]);
    expect(data.total).toBe(0);
  });
});
