import AddonsWebview from "@/components/Addons/AddonsWebview";
import {Alert, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import React from "react";
import {AddonPlacementManifest} from "@/addons/types";

function AddonPage ({navigation, route}): Screen<"AddonPage"> {
  const addon: AddonPlacementManifest = route.params.addon;
  let from = route.params.from;
  let data = route.params.data;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    navigation.setOptions({
      title: addon.manifest.name
    });
  });

  return (
    <View style={{flex: 1}}>
      <AddonsWebview
        navigation={navigation}
        addon={addon}
        url={addon.manifest.placement[addon.index].main}
        scrollEnabled={true}
        inset={insets}
        setTitle={(title) => navigation.setOptions({headerTitle: title})}
        data={data}
        requestNavigate={(url, data) => {
          //find the placement
          var index = -1;
          for(var i = 0; i < addon.manifest.placement.length; i++){
            if(addon.manifest.placement[i].name == url){
              index = i;
              break;
            }
          }
          if (index == -1) {
            Alert.alert("Error", "The requested page was not found."); //TODO: transfer error to webview
            return;
          } else {
            let newAddon: AddonPlacementManifest = {manifest: addon.manifest, index: index};
            navigation.push("Addon" + from + "Page", {addon: newAddon, from: from, data: data.data});
          }
        }}
      />
    </View>

  );
}

export default AddonPage;