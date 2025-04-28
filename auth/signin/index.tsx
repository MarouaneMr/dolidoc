import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { signInStyles } from "@/Styles/signInStyles";
import { ThemedText } from "@/components/ThemedText";
import InputComp from "@/components/InputComp";
import CustomButton from "@/components/CustomButton";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import Checkbox from "expo-checkbox";
import GoogleSvg from "@/Svg/GoogleSvg";
import { useNavigation } from "expo-router";
import CheckboxComp from "@/components/CheckboxComp";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import BlueBAckSvg from "@/Svg/BlueBAckSvg";
import BackSvg from "@/Svg/BackSvg";
import { useTranslation } from "react-i18next";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import Signin from "@/hooks/Signin";
import MainModal from "@/Modal/MainModal";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { AppointmentStyles } from "@/Styles/AppointmentStyles";
import CrossSvg from "@/Svg/CrossSvg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import PassReset from "@/hooks/PassReset";
import { ActivityIndicator } from "react-native-paper";
import PassComp from "@/components/PassComp";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [isChecked, setChecked] = useState<boolean>(false);
  const handleBackPress = () => {
    navigation.goBack();
  };
  const route = useRoute();
  const { role } = useSelector(authSelector);
  const {
    promptAsync,
    handleEmailChange,
    handlePasswordChange,
    signIn,
    formData,
    accloading,
  } = Signin();

  const {
    forgetModal,
    closeModal,
    openModal,
    email,
    setEmail,
    handlePasswordReset,
    loading,
  } = PassReset();

  const { toast } = useToast();
  const {
    googleSignIn,
    loading: googleSignInLoading,
    toast: googleAuthToast,
  } = useGoogleAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Progress loading={accloading || googleSignInLoading}></Progress>
      {(toast || googleAuthToast) && (
        <DynamicToast
          text={toast?.text || googleAuthToast?.text}
          heading={toast?.heading || googleAuthToast?.heading}
          type={toast?.type || googleAuthToast?.type}
        />
      )}
      <View style={signInStyles.Maincontainer}>
        <CustomButton
          style={RegisterScreenStyles.backbtn}
          onPress={handleBackPress}
        >
          <BackSvg />
        </CustomButton>

        <ThemedText type="authHeading">{t("welcome_back")}</ThemedText>
        <Text style={signInStyles.grayText}>{t("excited_message")}</Text>
        <View style={signInStyles.inputContainers}>
          <InputComp
            placeholder={t("email_placeholder")}
            placeHolderColor="#C2C2C2"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text: string) => handleEmailChange(text)}
          />
          <PassComp
            placeholder={t("password_placeholder")}
            placeHolderColor="#C2C2C2"
            password={true}
            value={formData.password}
            onChangeText={(text: string) => handlePasswordChange(text)}
          />
          <View style={signInStyles.container}>
            <View style={signInStyles.checkBox}>
              <Checkbox
                style={signInStyles.checkbox_Box}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "#107ACA" : undefined}
              />
              <Text style={signInStyles.checktext}>{t("remember_me")}</Text>
            </View>
            <CustomButton onPress={openModal}>
              <ThemedText type="bluetext">{t("forgot_password")}</ThemedText>
            </CustomButton>
          </View>

          <CustomButton style={signInStyles.loginbtn} onPress={() => signIn()}>
            <Text style={RegAsStyles.text}>{t("login")}</Text>
          </CustomButton>

          <View style={signInStyles.Orcontainer}>
            <View style={signInStyles.line} />
            <Text style={signInStyles.text}>{t("or_sign_in_with")}</Text>
            <View style={signInStyles.line} />
          </View>
          <View style={signInStyles.bottomContainee}>
            <CustomButton
              style={signInStyles.googlebtn}
              // onPress={() => promptAsync()}
              onPress={() => googleSignIn()}
            >
              <GoogleSvg />
            </CustomButton>
            <Text style={signInStyles.botGray}>
              {t("by_logging")}, {t("agree")} {t("terms_conditions")} {t("and")}{" "}
              {t("privacy_policy")}.
            </Text>
            <View style={signInStyles.bottomBtn}>
              <Text style={signInStyles.botblack}>
                {t("dont_have_account")}
              </Text>
              <CustomButton
                style={signInStyles.btn}
                onPress={() =>
                  navigation.navigate("auth/signup/index", { role })
                }
              >
                <Text style={signInStyles.botblue}>{t("sign_up")}</Text>
              </CustomButton>
            </View>
          </View>
        </View>
      </View>
      <MainModal open={forgetModal} close={closeModal}>
        <View style={DocterDashboardStyles.modal}>
          <CustomButton onPress={closeModal} style={AppointmentStyles.calBtn}>
            <CrossSvg />
          </CustomButton>
          <View>
            <ThemedText type="authHeading">Forgot Password</ThemedText>
            <Text style={signInStyles.grayText}>
              Enter your email for password reset
            </Text>
            <View style={{ marginVertical: responsiveHeight(2) }}>
              <InputComp
                placeholder={t("email_placeholder")}
                placeHolderColor="#C2C2C2"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <CustomButton
                style={signInStyles.resetbtn}
                onPress={handlePasswordReset}
              >
                <Text style={RegAsStyles.text}>Reset</Text>
              </CustomButton>
            </View>
          </View>
        </View>
      </MainModal>
    </ScrollView>
  );
}
