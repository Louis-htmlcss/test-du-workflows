import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Image, StyleSheet, FlatList, ListRenderItem, View } from "react-native";
import { Screen } from "@/router/helpers/types";
import { updateNewsInCache } from "@/services/news";
import { useNewsStore } from "@/stores/news";
import { useCurrentAccount } from "@/stores/account";
import { NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import { RefreshControl } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import BetaIndicator from "@/components/News/Beta";
import NewsListItem from "./Atoms/Item";
import Reanimated, { FadeInUp, FadeOut, LinearTransition } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { animPapillon } from "@/utils/ui/animations";
import { categorizeMessages } from "@/utils/magic/categorizeMessages";
import TabAnimatedTitle from "@/components/Global/TabAnimatedTitle";
import { protectScreenComponent } from "@/router/helpers/protected-screen";
import MissingItem from "@/components/Global/MissingItem";

type NewsItem = {
  date: string;
};

const NewsScreen: Screen<"News"> = ({ route, navigation }) => {
  const theme = useTheme();
  const account = useCurrentAccount((store) => store.account!);
  const informations = useNewsStore((store) => store.informations);

  const [isLoading, setIsLoading] = useState(false);
  const [importantMessages, setImportantMessages] = useState<NewsItem[]>([]);
  const [sortedMessages, setSortedMessages] = useState<NewsItem[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...TabAnimatedTitle({ theme, route, navigation }),
    });
  }, [navigation, route.params, theme.colors.text]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await updateNewsInCache(account);
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    fetchData();
  }, [account.instance]);

  useEffect(() => {
    if (informations) {
      if (account.personalization?.magicEnabled) {
        const { importantMessages, normalMessages } = categorizeMessages(informations);
        setImportantMessages(importantMessages.map(message => ({ ...message, date: message.date.toString() })));
        setSortedMessages(normalMessages.map(message => ({ ...message, date: message.date.toString() })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else {
        setImportantMessages([]);
        setSortedMessages(informations.map(info => ({ ...info, date: info.date.toString(), title: info.title || "" })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    }
  }, [informations, account.personalization?.magicEnabled]);

  const renderItem: ListRenderItem<NewsItem> = useCallback(({ item, index }) => (
    <NewsListItem
      key={index}
      index={index}
      message={item}
      navigation={navigation}
      parentMessages={sortedMessages}
    />
  ), [navigation, sortedMessages]);

  const NoNewsMessage = () => (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <MissingItem
        emoji={"🥱"}
        title={"Aucune actualité disponible"}
        description={"Malheureusement, il n'y a aucune actualité à afficher pour le moment."}
      />
    </View>
  );

  return (
    <Reanimated.ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
      }
    >
      {importantMessages.length > 0 && (
        <Reanimated.View
          entering={animPapillon(FadeInUp)}
          exiting={animPapillon(FadeOut)}
          layout={animPapillon(LinearTransition)}
        >
          <NativeListHeader
            label="Peut-être Important"
            animated
            leading={
              <Image
                source={require("@/../assets/images/magic/icon_magic.png")}
                style={styles.magicIcon}
                resizeMode="contain"
              />
            }
            trailing={<BetaIndicator />}
          />

          <NativeList animated>
            <LinearGradient
              colors={!theme.dark ? [theme.colors.card, "#BFF6EF"] : [theme.colors.card, "#2C2C2C"]}
              start={[0, 0]}
              end={[2, 0]}
            >
              <FlatList
                data={importantMessages}
                renderItem={renderItem}
                keyExtractor={(_, index) => `important-${index}`}
              />
            </LinearGradient>
          </NativeList>
        </Reanimated.View>
      )}

      {sortedMessages.length > 0 ? (
        <Reanimated.View
          entering={animPapillon(FadeInUp)}
          exiting={animPapillon(FadeOut)}
          layout={animPapillon(LinearTransition)}
        >
          <NativeList animated inline>
            <FlatList
              data={sortedMessages}
              renderItem={renderItem}
              keyExtractor={(_, index) => `sorted-${index}`}
            />
          </NativeList>
        </Reanimated.View>
      ) : (
        !isLoading && <NoNewsMessage />
      )}
    </Reanimated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
    paddingTop: 0,
  },
  magicIcon: {
    width: 26,
    height: 26,
    marginRight: 4
  },
  noNewsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default protectScreenComponent(NewsScreen);