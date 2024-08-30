import { useState } from "react";
import { Authenticator } from "pawrd";
import { AccountService, type ARDAccount } from "@/stores/account/types";
import uuid from "@/utils/uuid-v4";
import { useAccounts, useCurrentAccount } from "@/stores/account";
import LoginView from "@/components/Templates/LoginView";
import { Screen } from "@/router/helpers/types";

const ExternalArdLogin: Screen<"ExternalArdLogin"> = ({ navigation }) => {
  const linkExistingExternalAccount = useCurrentAccount(store => store.linkExistingExternalAccount);
  const create = useAccounts(store => store.create);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string, customFields: Record<string, string>): Promise<void> => {
    try {
      const authenticator = new Authenticator();
      const schoolID = customFields["schoolID"];

      const client = await authenticator.fromCredentials(schoolID, username, password);

      const new_account: ARDAccount = {
        instance: client,
        service: AccountService.ARD,
        username,
        authentication: {
          schoolID,
          username,
          password,
          pid: client.pid
        },
        isExternal: true,
        localID: uuid(),
        data: {}
      };

      create(new_account);
      linkExistingExternalAccount(new_account);

      navigation.navigate("QrcodeAnswer", { accountID: new_account.localID });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      else {
        setError("Une erreur est survenue lors de la connexion.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <LoginView
      serviceIcon={require("@/../assets/images/service_ard.png")}
      serviceName="ARD"
      onLogin={(username, password, customFields) => handleLogin(username, password, customFields)}
      loading={loading}
      error={error}
      customFields={[{
        identifier: "schoolID",
        title: "Identifiant de l'établissement",
        placeholder: "Identifiant de l'établissement",
        secureTextEntry: false
      }]}
    />
  );
};

export default ExternalArdLogin;
