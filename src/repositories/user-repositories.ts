import { User, Prisma } from "@prisma/client";
import { prisma } from "@/config";

async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function findUserById(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

async function deleteUser(userId: number) {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

async function updateUser(
  userId: number,
  data: Prisma.UserUncheckedUpdateInput
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
}

async function findAllUsers() {
  return prisma.user.findMany();
}

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

export type CreateUserParams = Pick<User, "email" | "password">;

export const userRepository = {
  createUser,
  findUserById,
  deleteUser,
  updateUser,
  findAllUsers,

  findByEmail,
};
