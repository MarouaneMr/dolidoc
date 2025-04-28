import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import ProfileSettingcontainer from "@/components/ProfileSettingcontainer";
import { UseAboutAppData } from "@/Data/UseAboutAppData";
import AboutAppNav from "@/Navigation/AboutAppNav";
import { useTranslation } from "react-i18next";
export default function AboutTheApp() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const { AppData } = UseAboutAppData();
  const { handleAppAboutavigation } = AboutAppNav();
  const {t} = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title={t("About the App")} onPress={handleBackPress} />
          <View style={LanguageScreenSttyles.container}>
            <FlatList
              data={AppData}
              renderItem={({ item, index }) => (
                <ProfileSettingcontainer
                  text={item.text}
                  onPress={() => {
                    handleAppAboutavigation(item);
                  }}
                >
                  <item.svg />
                </ProfileSettingcontainer>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={false}
              numColumns={1}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
