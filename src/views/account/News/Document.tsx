import InsetsBottomView from "@/components/Global/InsetsBottomView";
import { NativeItem, NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import InitialIndicator from "@/components/News/InitialIndicator";
import { Information } from "@/services/shared/Information";
import formatDate from "@/utils/format/format_date_complets";
import { useTheme } from "@react-navigation/native";
import { FileIcon, Link } from "lucide-react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import RenderHtml from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewsItem = ({route, navigation}) => {
  const message = route.params.message && JSON.parse(route.params.message) as Information;
  const important = route.params.important;

  console.log(message);

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: message.title,
    });
  }, [navigation, message.title]);

  const tagsStyles = {
    body: {
      color: theme.colors.text,
    },
    a: {
      color: theme.colors.primary,
      textDecorationColor: theme.colors.primary,
    },
  };

  function onPress (event, href) {
    Linking.openURL(href);
  }

  const renderersProps = {
    a: {
      onPress: onPress
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: 0,
      }}
    >
      <NativeList inline>
        <NativeItem
          leading={
            <InitialIndicator
              initial={message.author}
              color={theme.colors.primary}
            />
          }
        >
          <NativeText variant="title">
            {message.author}
          </NativeText>
          <NativeText variant="subtitle">
            {formatDate(message.date)} — {message.category}
          </NativeText>
        </NativeItem>
      </NativeList>

      <View
        style={{
          marginTop: 16,
        }}
      >
        <RenderHtml
          contentWidth={Dimensions.get("window").width - (16 * 2)}
          source={{
            html: message.content,
          }}
          tagsStyles={tagsStyles}
          renderersProps={renderersProps}
          ignoredStyles={["fontFamily", "fontSize"]}
          baseStyle={{
            fontFamily: "medium",
            fontSize: 16,
            color: theme.colors.text,
          }}
        />
      </View>

      {message.attachments.length > 0 && (
        <View>
          <NativeListHeader label="Pièces jointes" />

          <NativeList>
            {message.attachments.map((attachment, index) => (
              <NativeItem
                key={index}
                chevron={false}
                onPress={() => Linking.openURL(attachment.url)}
                icon={
                  typeof attachment.type === "file" ? (
                    <FileIcon />
                  ) : (
                    <Link />
                  )
                }
              >
                <NativeText variant="title" numberOfLines={1}>
                  {attachment.name}
                </NativeText>
                <NativeText variant="subtitle" numberOfLines={1}>
                  {attachment.url}
                </NativeText>
              </NativeItem>
            ))}
          </NativeList>
        </View>
      )}

      <InsetsBottomView />
    </ScrollView>
  );
};

export default NewsItem;