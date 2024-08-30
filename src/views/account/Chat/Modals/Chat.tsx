import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import type { Screen } from "@/router/helpers/types";
import {
  NativeText,
} from "@/components/Global/NativeComponents";
import { useCurrentAccount } from "@/stores/account";
import TabAnimatedTitle from "@/components/Global/TabAnimatedTitle";
import type { ChatMessage } from "@/services/shared/Chat";
import { getChatMessages } from "@/services/chats";

const Chat: Screen<"Chat"> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const account = useCurrentAccount(state => state.account!);
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);

  useEffect(() => {
    void async function () {
      const messages = await getChatMessages(account, route.params.handle);
      setMessages(messages);
    }();
  }, [route.params.handle]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      {messages?.map((message) => (
        <NativeText key={message.id}>
          {message.author} (${message.date.toLocaleString("fr-FR")}): {message.content}
        </NativeText>
      )) || (
        <NativeText>
          Chargement des messages...
        </NativeText>
      )}
    </ScrollView>
  );
};


export default Chat;
