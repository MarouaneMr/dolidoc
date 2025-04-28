import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
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
import ClinicProfile from "../ClinicProfile";
export default function profile() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const { SettingData } = UseSettingData();
  const { handleClinicSettingNavigation } = SettingNav();
  const { modal, openLogoutModal, closeLogoutModal, logout } = Logout();
  const { t } = useTranslation();
  const { user } = useSelector(authSelector);
console.log("User: ",user.profile_completed);
// useEffect(()=>{
//   if(!user.profile_completed){
//     navigation.navigate("ClinicProfile");
//   }
// },[]);
if(user.profile_completed)
{
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title={t("setting")} onPress={handleBackPress} />

          <View style={LanguageScreenSttyles.container}>
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
                      handleClinicSettingNavigation(item);
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
 );
}
else{
  return(
<ClinicProfile/>)
}
}