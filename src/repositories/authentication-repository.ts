import { prisma } from "@/config";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

async function createSession(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}

async function findSession(token: string) {
  return prisma.session.findFirst({
    where: {
      token,
    },
  });
}

async function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: dayjs().toDate(),
      },
    },
  });
}

export const authenticationRepository = {
  createSession,
  findSession,
  deleteExpiredSessions,
};
