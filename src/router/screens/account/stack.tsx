import React from "react";
import { Dimensions, View } from "react-native";
import screens from ".";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useCurrentAccount } from "@/stores/account";
import PapillonTabNavigator from "@/router/helpers/PapillonTabNavigator";
import { Screen } from "@/router/helpers/types";

export const AccountStack = PapillonTabNavigator();
const screenOptions: NativeStackNavigationOptions = {
  headerBackTitleStyle: {
    fontFamily: "medium",
  },
  headerTitleStyle: {
    fontFamily: "semibold",
  },
  headerBackTitle: "Retour",
  // @ts-expect-error : not sure if the type object is correct
  tabBarStyle: {
    position: "absolute",
  },
};

function TabBarContainer () {
  return (
    <View />
  );
}

const AccountStackScreen: Screen<"AccountStack"> = () => {
  const account = useCurrentAccount(store => store.account);

  const dims = Dimensions.get("window");
  const tablet = dims.width > 600;

  let newAccountScreens = screens;

  if (account?.personalization.tabs) {
    let newTabs = account.personalization.tabs;
    if (!tablet) {
      newTabs = newTabs.filter(tab => tab.enabled);
    }

    newAccountScreens = newTabs.map(tab => {
      const tabData = screens.find(t => t.name === tab.name);
      if(tabData) {
        tabData.options = {
          ...tabData.options,
          tabEnabled: tab.enabled,
        };
        return tabData;
      }
    });
  }

  let mln = 5 - newAccountScreens.length;
  if (mln < 0) { mln = 0; }

  if (tablet) {
    mln = 0;
  }

  const mScreenLoop = new Array(mln).fill(0);

  let finalScreens = newAccountScreens;
  if (!tablet) {
    finalScreens = newAccountScreens.splice(0, 5);
  }

  return (
    <AccountStack.Navigator screenOptions={screenOptions} tabBar={TabBarContainer}>
      {finalScreens.map((screen) => (
        // @ts-expect-error : type not compatible, but it works fine.
        <AccountStack.Screen
          key={screen.name}
          {...screen}
          initialParams={{
            outsideNav: false
          }}
        />
      ))}
      {/* pour ne pas casser les hooks */}
      {mScreenLoop.map((_, index) => (
        <AccountStack.Screen
          key={"usl_" + index}
          name={"usl_" + index}
          component={UslView}
        />
      ))}
    </AccountStack.Navigator>
  );
};

const UslView: React.FC = () => {
  return (
    <View />
  );
};

export default AccountStackScreen;