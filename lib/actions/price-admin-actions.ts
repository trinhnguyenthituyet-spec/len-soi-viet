"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updatePriceListing(id: string, pricePer100g: number) {
  if (!Number.isFinite(pricePer100g) || pricePer100g <= 0) {
    throw new Error("Giá phải là số dương.");
  }
  await prisma.priceListing.update({
    where: { id },
    data: { pricePer100g, lastVerified: new Date(), source: "manual" },
  });
  revalidatePath("/admin/prices");
  revalidatePath("/yarn");
}

export async function toggleInStock(id: string, nextInStock: boolean) {
  await prisma.priceListing.update({ where: { id }, data: { inStock: nextInStock } });
  revalidatePath("/admin/prices");
  revalidatePath("/yarn");
}
