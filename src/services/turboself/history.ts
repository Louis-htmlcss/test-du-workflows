import type { TurboselfAccount } from "@/stores/account/types";
import type { ReservationHistory } from "../shared/ReservationHistory";
import { summary } from "turbawself";

export const getHistory = async (account: TurboselfAccount): Promise<ReservationHistory[]> => {
  const h = await summary(account.authentication.auth, account.authentication.session);

  return (h.history ?? []).map((reservation) => ({
    timestamp: reservation.date.getTime(),
    amount: reservation.amount / 100,
    currency: "€"
  }));
};
