import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import RegisterAs from "@/app/RegisterAs";
import { useNavigation } from "expo-router";
import TopContainer from "@/components/TopContainer";
import CheckMarkSvg from "@/Svg/CheckMarkSvg";
import { useTranslation } from "react-i18next";

export default function SuccessScreen() {
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={RegAsStyles.Maincontainer}>
          <TopContainer onPress={backPress} />
            </View>
          <View style={RegisterScreenStyles.container}>
            {/* <Image
              style={RegisterScreenStyles.successimg}
              source={require("../../../assets/images/success.png")}
            /> */}
            <CheckMarkSvg/>
            <Text style={RegisterScreenStyles.successtxt}>
              {t("successful_registration_doctor")}
             
            </Text>
          </View>
      </ScrollView>
      <CustomButton
        style={RegisterScreenStyles.nextbtn}
        onPress={() => navigation.navigate("subscription/index")}
      >
        <Text style={RegAsStyles.text}>{t("subscribe")}</Text>
      </CustomButton>
    </View>
  );
}
