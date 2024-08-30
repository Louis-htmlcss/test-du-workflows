import type { TurboselfAccount } from "@/stores/account/types";
import { login } from "turbawself";

export const reload = async (account: TurboselfAccount): Promise<TurboselfAccount["authentication"]["auth"]> => {
  const auth = { ...account.authentication.auth }; // make sure to make a copy of the object.
  await login(auth);
  return auth;
};