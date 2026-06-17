import { prisma } from "./prisma";

export async function getSellers(search?: string) {
  const searchTerm = search?.trim();
  return prisma.seller.findMany({
    where: {
      deletedAt: null,
      ...(searchTerm ? { name: { contains: searchTerm, mode: "insensitive" } } : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getSellerById(id: string) {
  return prisma.seller.findFirst({ where: { id, deletedAt: null } });
}
