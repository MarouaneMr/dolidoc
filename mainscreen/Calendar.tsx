import { View, SafeAreaView, ScrollView, Image, Text } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { CalendarScreenStyles } from "@/Styles/CalendarScreenStyles";
import FullCalendar from "../FullCalendar";
import { useTranslation } from "react-i18next";
import { useCheckUser } from "@/hooks/checkUser";
import ProfileHook from "@/hooks/ProfileHook";
import CustomButton from "@/components/CustomButton";
import DoctorSvg from "@/Svg/DoctorSvg";
import PatientSvg from "@/Svg/PatientSvg";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import SelectRole from "../auth/role/SelectRole";
import { isAuthenticated } from "@/utils/authentication/authentication";

export default function Calendar() {
  const navigation = useNavigation<any>();
  const { user } = useSelector(authSelector);
  const { t } = useTranslation();
  return (
    <>
      {!user || !isAuthenticated() ? (
        <>
          <SelectRole />
        </>
      ) : (
        <>
          <View style={CalendarScreenStyles.Maincontainer}>
            <TopContainer
              title={t("calendar")}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={CalendarScreenStyles.container}>
            <FullCalendar />
          </View>
        </>
      )}
    </>
  );
}
