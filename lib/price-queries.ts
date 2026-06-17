import { prisma } from "./prisma";

export async function getAllPriceListings() {
  return prisma.priceListing.findMany({
    include: { yarnType: true, seller: true },
    orderBy: [{ yarnType: { nameVi: "asc" } }, { pricePer100g: "asc" }],
  });
}

export async function getPriceListingById(id: string) {
  return prisma.priceListing.findUnique({ where: { id }, include: { yarnType: true, seller: true } });
}

export async function getNeedsAttentionYarns() {
  return prisma.yarnType.findMany({
    where: { deletedAt: null, descriptionVi: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNeedsAttentionSellers() {
  return prisma.seller.findMany({
    where: { deletedAt: null, verified: false },
    orderBy: { createdAt: "desc" },
  });
}
