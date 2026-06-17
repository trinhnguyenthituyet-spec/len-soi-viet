"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-image";
import type { Prisma } from "@/lib/generated/prisma/client";

function splitTags(value: FormDataEntryValue | null): string[] {
  const text = typeof value === "string" ? value : "";
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function optionalString(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : null;
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

async function buildYarnData(formData: FormData, currentHeroImageUrl: string | null) {
  const nameVi = String(formData.get("nameVi") ?? "").trim();
  if (!nameVi) throw new Error("Tên sợi là bắt buộc.");

  let heroImageUrl = currentHeroImageUrl;
  const file = formData.get("heroImage");
  if (file instanceof File && file.size > 0) {
    const result = await uploadImage(file);
    heroImageUrl = result.url;
  }

  return {
    nameVi,
    nameEn: optionalString(formData.get("nameEn")),
    fiberCategory: (optionalString(formData.get("fiberCategory")) as never) ?? null,
    fiberComposition: optionalString(formData.get("fiberComposition")),
    weightCategory: (optionalString(formData.get("weightCategory")) as never) ?? null,
    texture: splitTags(formData.get("texture")),
    warmth: optionalInt(formData.get("warmth")),
    softness: optionalInt(formData.get("softness")),
    durability: optionalInt(formData.get("durability")),
    stretch: optionalInt(formData.get("stretch")),
    washability: (optionalString(formData.get("washability")) as never) ?? null,
    allergyRisk: (optionalString(formData.get("allergyRisk")) as never) ?? null,
    useCases: splitTags(formData.get("useCases")),
    careInstructions: optionalString(formData.get("careInstructions")),
    descriptionVi: optionalString(formData.get("descriptionVi")),
    pros: splitTags(formData.get("pros")),
    cons: splitTags(formData.get("cons")),
    tags: splitTags(formData.get("tags")),
    heroImageUrl,
  } satisfies Partial<Prisma.YarnTypeUncheckedCreateInput>;
}

export interface YarnFormState {
  error?: string;
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
    return "Tên sợi này đã tồn tại (trùng slug). Hãy đổi tên sợi.";
  }
  if (err instanceof Error) return err.message;
  return "Đã có lỗi xảy ra, vui lòng thử lại.";
}

export async function createYarnType(
  _prevState: YarnFormState | undefined,
  formData: FormData,
): Promise<YarnFormState> {
  try {
    const data = await buildYarnData(formData, null);
    const slug = slugify(data.nameVi);
    await prisma.yarnType.create({ data: { ...data, slug } });
  } catch (err) {
    return { error: toErrorMessage(err) };
  }

  revalidatePath("/admin/yarn");
  revalidatePath("/yarn");
  redirect("/admin/yarn");
}

export async function updateYarnType(
  id: string,
  currentHeroImageUrl: string | null,
  _prevState: YarnFormState | undefined,
  formData: FormData,
): Promise<YarnFormState> {
  let slug: string;
  try {
    const data = await buildYarnData(formData, currentHeroImageUrl);
    const yarn = await prisma.yarnType.update({ where: { id }, data });
    slug = yarn.slug;
  } catch (err) {
    return { error: toErrorMessage(err) };
  }

  revalidatePath("/admin/yarn");
  revalidatePath("/yarn");
  revalidatePath(`/yarn/${slug}`);
  redirect("/admin/yarn");
}

export async function softDeleteYarnType(id: string) {
  await prisma.yarnType.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/yarn");
  revalidatePath("/yarn");
}
