import { View, SafeAreaView } from "react-native";
import React from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { CalendarScreenStyles } from "@/Styles/CalendarScreenStyles";
import FullCalendar from "../FullCalendar";
import { useTranslation } from "react-i18next";

export default function CalendarScreen() {
  const navigation = useNavigation<any>();

  const handleBackPress = () => {
    navigation.goBack();
  }; 
  const { t } = useTranslation();

  return (
    <>
      <View style={CalendarScreenStyles.Maincontainer} >
      <TopContainer title={t("calendar")} onPress={handleBackPress} />

      </View>
      <View style={CalendarScreenStyles.container}>
        <FullCalendar />
      </View>
    </>
  );
}
