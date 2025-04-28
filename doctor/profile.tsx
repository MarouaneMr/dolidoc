import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { MyAppointmentsStyles } from "@/Styles/MyAppointmentsStyles";
import ProfileSettingcontainer from "@/components/ProfileSettingcontainer";
import { UseSettingData } from "@/Data/UseSettingData";
import ProfileSettingNav from "@/Navigation/SettingNav";
import SettingNav from "@/Navigation/SettingNav";
import MainModal from "@/Modal/MainModal";
import Logout from "@/hooks/Logout";
import Modalstyles from "@/Styles/Modal";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { SettingStyles } from "@/Styles/SettingStyles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import { isAuthenticated } from "@/utils/authentication/authentication";
import SelectRole from "../auth/role/SelectRole";
import DoctorProfile from "../doctorProfileView/DoctorProfile/DoctorProfile";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
export default function Profile() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };


  const { user, role, profile_completed, isInitialized } =
  useSelector(authSelector);
  const { SettingData } = UseSettingData();
  const { handleSettingNavigation } = SettingNav();
  const { modal, openLogoutModal, closeLogoutModal, logout,loading } = Logout();
  const { t } = useTranslation();
  // console.log("Completed: ",profile_completed);
  return (
    <>
      {!isAuthenticated() || !isInitialized ? (
            <SelectRole />
          ) : role === "doctor" && !user?.profile_completed && !profile_completed ? (
            <DoctorProfile />
          ):
 ( 
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title={t("setting")} onPress={handleBackPress} />
          <View style={LanguageScreenSttyles.container}>
            <Progress loading={loading}/>
            <FlatList
              data={SettingData}
              renderItem={({ item, index }) => (
                <ProfileSettingcontainer
                  text={item.text}
                  textStyle={
                    item.text === t("logout") ? { color: "#FF4C5E" } : {}
                  }
                  onPress={() => {
                    if (item.text === t("logout")) {
                      openLogoutModal();
                    } else {
                      handleSettingNavigation(item);
                    }
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
      <MainModal open={modal} close={closeLogoutModal}>
        <View style={SettingStyles.modal}>
          <View style={SettingStyles.container}>
            <ThemedText type="SecLightHeading">{t("logoutTitle")}</ThemedText>
            <Text style={SettingStyles.message}>{t("logoutMessage")}</Text>
          </View>
          <View style={SettingStyles.btnConatiner}>
            <CustomButton
              onPress={closeLogoutModal}
              style={SettingStyles.cancelbtn}
            >
              <Text style={SettingStyles.canceltext}> {t("cancel")}</Text>
            </CustomButton>
            <CustomButton style={SettingStyles.logouttext} onPress={logout}>
              <Text style={SettingStyles.logouttext}> {t("logout")}</Text>
            </CustomButton>
          </View>
        </View>
      </MainModal>
    </View>
    )
  }
    </>
  );
}
