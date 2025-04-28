import { View, SafeAreaView } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { CalendarScreenStyles } from "@/Styles/CalendarScreenStyles";
import FullCalendar from "../FullCalendar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";

export default function CalendarScreen() {
  const navigation = useNavigation<any>();

  const handleBackPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  return (
    <>
      <View style={CalendarScreenStyles.Maincontainer}>
        <TopContainer title={t("calendar")} onPress={handleBackPress} />
      </View>
      <View style={CalendarScreenStyles.container}>
        <FullCalendar />
      </View>
    </>
  );
}
