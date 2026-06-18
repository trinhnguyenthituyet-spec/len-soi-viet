"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function adjustPatternSavedCount(patternId: string, delta: 1 | -1) {
  if (delta > 0) {
    await prisma.pattern.update({
      where: { id: patternId },
      data: { savedCount: { increment: 1 } },
    });
  } else {
    await prisma.pattern.updateMany({
      where: { id: patternId, savedCount: { gt: 0 } },
      data: { savedCount: { decrement: 1 } },
    });
  }
  revalidatePath("/admin");
}
