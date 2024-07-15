import { BitrixPlatform, Prisma } from "@prisma/client";
import { prisma } from "@/config";

async function createBitrixPlatform(data: Prisma.BitrixPlatformCreateInput) {
  return prisma.bitrixPlatform.create({
    data,
  });
}

async function findBitrixPlatformById(bitrixPlatformId: number) {
  return prisma.bitrixPlatform.findUnique({
    where: {
      id: bitrixPlatformId,
    },
  });
}

async function deleteBitrixPlatform(bitrixPlatformId: number) {
  return prisma.bitrixPlatform.delete({
    where: {
      id: bitrixPlatformId,
    },
  });
}

async function updateBitrixPlatform(
  bitrixPlatformId: number,
  data: Prisma.BitrixPlatformUncheckedUpdateInput
) {
  return prisma.bitrixPlatform.update({
    where: {
      id: bitrixPlatformId,
    },
    data,
  });
}

async function findAllBitrixPlatforms() {
  return prisma.bitrixPlatform.findMany();
}

async function findBitrixPlatformByUrl(url: string) {
  return prisma.bitrixPlatform.findFirst({
    where: {
      url,
    },
  });
}

async function findBitrixPlatformByUserId(userId: number) {
  return prisma.bitrixPlatform.findFirst({
    where: {
      userId,
    },
  });
}

export type CreateBitrixPlatformParams = Pick<BitrixPlatform, "url">;

export const bitrixPlatformRepository = {
  createBitrixPlatform,
  findBitrixPlatformById,
  deleteBitrixPlatform,
  updateBitrixPlatform,
  findAllBitrixPlatforms,
  findBitrixPlatformByUrl,
  findBitrixPlatformByUserId,
};
