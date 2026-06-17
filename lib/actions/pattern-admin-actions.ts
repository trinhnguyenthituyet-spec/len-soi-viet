"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-image";
import type { Prisma } from "@/lib/generated/prisma/client";

export interface PatternFormState {
  error?: string;
}

export interface StepInput {
  tempId: string;
  order: number;
  title: string;
  content: string;
  tip: string;
  videoUrl: string;
  existingImageUrl: string;
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
    return "Tên mẫu này đã tồn tại (trùng slug). Hãy đổi tên mẫu.";
  }
  if (err instanceof Error) return err.message;
  return "Đã có lỗi xảy ra, vui lòng thử lại.";
}

function optionalString(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : null;
}

function splitTags(value: FormDataEntryValue | null): string[] {
  const text = typeof value === "string" ? value : "";
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function buildStepsData(formData: FormData) {
  const stepsRaw = String(formData.get("stepsJson") ?? "[]");
  const steps: StepInput[] = JSON.parse(stepsRaw);

  const result = [];
  for (const step of steps) {
    let imageUrl = step.existingImageUrl || null;
    const file = formData.get(`stepImage_${step.tempId}`);
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadImage(file);
      imageUrl = uploaded.url;
    }
    result.push({
      order: step.order,
      title: step.title,
      content: step.content,
      tip: step.tip || null,
      videoUrl: step.videoUrl || null,
      imageUrl,
    });
  }
  return result;
}

async function buildGalleryImages(formData: FormData, existingImages: string[]) {
  const keep = formData.getAll("keepImage");
  const kept = existingImages.filter((url) => keep.includes(url));

  const files = formData.getAll("galleryImages");
  const uploaded: string[] = [];
  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      const result = await uploadImage(file);
      uploaded.push(result.url);
    }
  }

  return [...kept, ...uploaded];
}

async function buildPatternData(formData: FormData, existingImages: string[], existingThumbnail: string | null) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Tên mẫu là bắt buộc.");

  let thumbnailUrl = existingThumbnail;
  const thumbFile = formData.get("thumbnail");
  if (thumbFile instanceof File && thumbFile.size > 0) {
    const result = await uploadImage(thumbFile);
    thumbnailUrl = result.url;
  }

  const images = await buildGalleryImages(formData, existingImages);
  const steps = await buildStepsData(formData);
  const suitableYarnIds = formData.getAll("suitableYarnIds").map(String);

  return {
    title,
    craftType: String(formData.get("craftType") ?? "knitting") as never,
    difficulty: String(formData.get("difficulty") ?? "beginner") as never,
    category: String(formData.get("category") ?? "accessories") as never,
    subcategory: optionalString(formData.get("subcategory")),
    thumbnailUrl,
    images,
    yarnWeight: (optionalString(formData.get("yarnWeight")) as never) ?? null,
    hookNeedleSize: optionalString(formData.get("hookNeedleSize")),
    gauge: optionalString(formData.get("gauge")),
    finishedSize: optionalString(formData.get("finishedSize")),
    yarnAmount: optionalString(formData.get("yarnAmount")),
    timeEstimate: optionalString(formData.get("timeEstimate")),
    description: optionalString(formData.get("description")),
    tags: splitTags(formData.get("tags")),
    sourceUrl: optionalString(formData.get("sourceUrl")),
    sourceCredit: optionalString(formData.get("sourceCredit")),
    isOriginal: formData.get("isOriginal") === "on",
    suitableYarnIds,
    steps,
  };
}

export async function createPattern(
  _prevState: PatternFormState | undefined,
  formData: FormData,
): Promise<PatternFormState> {
  try {
    const data = await buildPatternData(formData, [], null);
    const slug = slugify(data.title);

    await prisma.pattern.create({
      data: {
        slug,
        title: data.title,
        craftType: data.craftType,
        difficulty: data.difficulty,
        category: data.category,
        subcategory: data.subcategory,
        thumbnailUrl: data.thumbnailUrl,
        images: data.images,
        yarnWeight: data.yarnWeight,
        hookNeedleSize: data.hookNeedleSize,
        gauge: data.gauge,
        finishedSize: data.finishedSize,
        yarnAmount: data.yarnAmount,
        timeEstimate: data.timeEstimate,
        description: data.description,
        tags: data.tags,
        sourceUrl: data.sourceUrl,
        sourceCredit: data.sourceCredit,
        isOriginal: data.isOriginal,
        suitableYarns: { connect: data.suitableYarnIds.map((id) => ({ id })) },
        steps: {
          create: data.steps.map((s) => ({
            order: s.order,
            title: s.title,
            content: s.content,
            tip: s.tip,
            videoUrl: s.videoUrl,
            imageUrl: s.imageUrl,
          })),
        },
      },
    });
  } catch (err) {
    return { error: toErrorMessage(err) };
  }

  revalidatePath("/admin/patterns");
  revalidatePath("/patterns");
  redirect("/admin/patterns");
}

export async function updatePattern(
  id: string,
  existingImages: string[],
  existingThumbnail: string | null,
  _prevState: PatternFormState | undefined,
  formData: FormData,
): Promise<PatternFormState> {
  let slug: string;
  try {
    const data = await buildPatternData(formData, existingImages, existingThumbnail);

    const pattern = await prisma.$transaction(async (tx) => {
      await tx.step.deleteMany({ where: { patternId: id } });
      return tx.pattern.update({
        where: { id },
        data: {
          title: data.title,
          craftType: data.craftType,
          difficulty: data.difficulty,
          category: data.category,
          subcategory: data.subcategory,
          thumbnailUrl: data.thumbnailUrl,
          images: data.images,
          yarnWeight: data.yarnWeight,
          hookNeedleSize: data.hookNeedleSize,
          gauge: data.gauge,
          finishedSize: data.finishedSize,
          yarnAmount: data.yarnAmount,
          timeEstimate: data.timeEstimate,
          description: data.description,
          tags: data.tags,
          sourceUrl: data.sourceUrl,
          sourceCredit: data.sourceCredit,
          isOriginal: data.isOriginal,
          suitableYarns: { set: data.suitableYarnIds.map((yid) => ({ id: yid })) },
          steps: {
            create: data.steps.map((s) => ({
              order: s.order,
              title: s.title,
              content: s.content,
              tip: s.tip,
              videoUrl: s.videoUrl,
              imageUrl: s.imageUrl,
            })),
          },
        },
      });
    });
    slug = pattern.slug;
  } catch (err) {
    return { error: toErrorMessage(err) };
  }

  revalidatePath("/admin/patterns");
  revalidatePath("/patterns");
  revalidatePath(`/patterns/${slug}`);
  redirect("/admin/patterns");
}
