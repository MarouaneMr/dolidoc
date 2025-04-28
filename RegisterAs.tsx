import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import CustomButton from "@/components/CustomButton";
import DoctorSvg from "@/Svg/DoctorSvg";
import PatientSvg from "@/Svg/PatientSvg";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

export default function RegisterAs() {
  const [activeView, setActiveView] = useState("doctor");
const navigation = useNavigation<any>()
const handleBackPress = () => {
  navigation.goBack();
};
const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={RegAsStyles.Maincontainer}>
          <TopContainer title={t("login_register")} onPress={handleBackPress} />
            <View style={RegAsStyles.container}>
              <Image
                source={require("../assets/images/logo.png")}
                style={RegAsStyles.logo}
              />
              <Text style={RegAsStyles.mainheading}>DoliDocs</Text>
              <View>
                <Text style={RegAsStyles.optText}>
                  {t("register_description")}
                 
                </Text>
                <View style={RegAsStyles.buttonconatiner}>
                  <CustomButton
                    onPress={() => setActiveView("doctor")}
                    style={[
                      RegAsStyles.btncont,
                      activeView === "doctor" && RegAsStyles.activebtn,
                    ]}
                  >
                    <View
                      style={[
                        RegAsStyles.svg,
                        activeView === "doctor" && RegAsStyles.activesvg,
                      ]}
                    >
                      <DoctorSvg />
                    </View>
                    <Text
                      style={[
                        RegAsStyles.bluetext,
                        activeView === "doctor" && RegAsStyles.text,
                      ]}
                    >
                      {t("Doctor")}
                    </Text>
                  </CustomButton>
                  <CustomButton
                    onPress={() => setActiveView("patient")}
                    style={[
                      RegAsStyles.btncont,
                      activeView === "patient" && RegAsStyles.activebtn,
                    ]}
                  >
                    <View
                      style={[
                        RegAsStyles.svg,
                        activeView === "patient" && RegAsStyles.activesvg,
                      ]}
                    >
                      <PatientSvg />
                    </View>
                    <Text
                      style={[
                        RegAsStyles.bluetext,
                        activeView === "patient" && RegAsStyles.text,
                      ]}
                    >
                      {t("patient")}
                    </Text>
                  </CustomButton>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={RegAsStyles.bottomContainer}>
          <CustomButton style={RegAsStyles.continuebtn} onPress={()=> navigation.navigate("auth/signin/index")}>
            <Text style={RegAsStyles.text}>{t("continue")}</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
}
