import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "@/errors";
import { authenticationRepository, userRepository } from "@/repositories";
import { exclude } from "@/utils/prisma-utils";
import { get7DaysFromNow, oneHour } from "@/utils/time-utils";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const session = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token: session.token,
    expiresAt: session.expiresAt,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, {
    id: true,
    email: true,
    password: true,
  });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const options = {
    expiresIn: "7d",
  };
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, options);

  const session = await authenticationRepository.createSession({
    token,
    userId,
    expiresAt: get7DaysFromNow(), // 1 week
  });

  return { token, expiresAt: session.expiresAt };
}

async function clearExpiredSessions() {
  await authenticationRepository.deleteExpiredSessions();
}

setInterval(clearExpiredSessions, oneHour()); // 1 hour

async function validatePasswordOrFail(password: string, userPassword: string) {
  //  const isPasswordValid = await bcrypt.compare(password, userPassword);
  const isPasswordValid = password === userPassword;

  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
  expiresAt: Date;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

export const authenticationService = {
  signIn,
};
