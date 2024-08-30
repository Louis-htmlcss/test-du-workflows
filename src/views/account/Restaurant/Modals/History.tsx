import { NativeText } from "@/components/Global/NativeComponents";
import { ReservationHistory } from "@/services/shared/ReservationHistory";
import { useAccounts, useCurrentAccount } from "@/stores/account";
import type { ExternalAccount } from "@/stores/account/types";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const RestaurantHistory = () => {
  const accounts = useAccounts((state) => state.accounts);
  const account = useCurrentAccount(store => store.account);

  const linkedAccounts = useMemo(() => {
    return account?.linkedExternalLocalIDs.map((linkedID) => {
      return accounts.find((acc) => acc.localID === linkedID);
    }).filter(Boolean) as ExternalAccount[] ?? [];
  }, [account?.linkedExternalLocalIDs, accounts]);

  const [history, setHistory] = useState<ReservationHistory[] | null>(null);
  useEffect(() => {
    void async function () {
      const account = linkedAccounts[0];
      if (account) {
        const { reservationHistoryFromExternal } = await import("@/services/reservation-history");
        const history = await reservationHistoryFromExternal(account);
        setHistory(history);
      }
    }();
  });

  return (
    <View>
      <NativeText>Reservation history !!!!</NativeText>

      {history === null ? (
        <NativeText>Chargement...</NativeText>
      ) : history.length === 0 ? (
        <NativeText>Aucune réservation</NativeText>
      ) : (
        history.map((reservation, index) => (
          <NativeText key={index}>{reservation.amount}{reservation.currency} le {new Date(reservation.timestamp).toLocaleString("fr-FR")}</NativeText>
        ))
      )}
    </View>
  );
};

export default RestaurantHistory;
