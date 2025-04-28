import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { MyAppointmentsStyles } from "@/Styles/MyAppointmentsStyles";
import ProfileSettingcontainer from "@/components/ProfileSettingcontainer";
import { UseSettingData } from "@/Data/UseSettingData";
import { UseProfileSettingData } from "@/Data/UseProfileSettingData";
import ProfileSettingNav from "@/Navigation/ProfileSettingNav";
import { useTranslation } from "react-i18next";
export default function ProfileSetting() {
  const navigation = useNavigation<any>();
  // const handleBackPress = () => {
  //   navigation.goBack();
  // };
  const { ProfileSettingData } = UseProfileSettingData();
  const { handleProfileSetting } = ProfileSettingNav();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
        <TopContainer title={t("Profile Setting")} onPress={()=>navigation.goBack()} />
        <View style={LanguageScreenSttyles.container}>
            <FlatList
              data={ProfileSettingData}
              renderItem={({ item, index }) => (
                <ProfileSettingcontainer
                  text={item.text}
                  onPress={() => {
                    handleProfileSetting(item);
                  }}
                >
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
