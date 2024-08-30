import { SkolengoAccount } from "@/stores/account/types";
import { Reconnected } from "../reload-account";
import { getSkolengoAccount } from "./skolengo-account";

export const reload = async (account: SkolengoAccount): Promise<Reconnected<SkolengoAccount>> => {

  if(!account.instance) {
    const acc = getSkolengoAccount(account.authentication);
    account.instance = acc.instance;
    account.authentication = acc.authentication;
  }

  return {
    instance: account.instance,
    authentication: account.authentication
  };
};
