import { duplicatedUserError } from "@/errors";
import { userRepository } from "@/repositories";
import { User } from "@prisma/client";

async function validateUniqueEmailOrFail(email: string) {
  const duplicateUser = await userRepository.findByEmail(email);
  if (duplicateUser) {
    throw duplicatedUserError();
  }
}

async function createUser(email: string, password: string): Promise<User> {
  await validateUniqueEmailOrFail(email);
  return userRepository.createUser({ email, password });
}

async function getUser(id: number): Promise<User | null> {
  return userRepository.findUserById(id);
}

export type CreateUserParams = Pick<User, "email" | "password">;

export const userService = {
  createUser,
  getUser,
};
