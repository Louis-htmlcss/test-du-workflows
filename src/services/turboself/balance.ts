import type { TurboselfAccount } from "@/stores/account/types";
import { balance, host } from "turbawself";
import type { Balance } from "../shared/Balance";

export const getBalance = async (account: TurboselfAccount): Promise<Balance> => {
  const b = await balance(account.authentication.auth, account.authentication.session);
  const h = await host(account.authentication.auth, account.authentication.session);

  return {
    amount: b.amount / 100,
    currency: "€",
    remaining: Math.floor(b.amount / h.lunchPrice)

    // since turboself is french, we can assume the currency is always euro.
    // note: would need more information to be sure.
  };
};