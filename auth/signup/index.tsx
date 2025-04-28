import { View, Text, ScrollView, Alert, Image } from "react-native";
import React, { useContext, useState } from "react";
import { signInStyles } from "@/Styles/signInStyles";
import { ThemedText } from "@/components/ThemedText";
import InputComp from "@/components/InputComp";
import CustomButton from "@/components/CustomButton";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import GoogleSvg from "@/Svg/GoogleSvg";
import { useNavigation } from "expo-router";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import BackSvg from "@/Svg/BackSvg";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import SignUpHook from "@/hooks/SignUpHook";
import PassComp from "@/components/PassComp";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setRole } from "@/Redux/Slices/auth";

export default function SignUp() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const route = useRoute();
  const info = route?.params?.info;
  const { role } = useSelector(authSelector);
  const {
    errors,
    formData,
    handleBackPress,
    handleEmailChange,
    handleConfirmPasswordChange,
    handlePasswordChange,
    HandelSignup,
    handleFirstNameChange,
    accloading,
    loading,
    setLoading,
  } = SignUpHook();
  const { toast } = useToast();
  const {
    googleSignUp,
    loading: googleSignUpLoading,
    toast: googleAuthToast,
  } = useGoogleAuth();

  return (
    <View style={{ flex: 1 }}>
      <Progress loading={loading || googleSignUpLoading} />
      {(toast || googleAuthToast) && (
        <DynamicToast
          text={toast?.text || googleAuthToast?.text}
          heading={toast?.heading || googleAuthToast?.heading}
          type={toast?.type || googleAuthToast?.type}
        />
      )}

      <ScrollView style={{ backgroundColor: "white" }}>
        <View style={signInStyles.Maincontainer}>
          <CustomButton
            style={RegisterScreenStyles.backbtn}
            onPress={() => {
              if (info === "As Doctor") {
                dispatch(setRole("patient"));
              }
              handleBackPress();
            }}
          >
            <BackSvg />
          </CustomButton>
          {role === "doctor" ? (
            <>
              <ThemedText type="authHeading">
                {t("create_account_doctor")}
              </ThemedText>
            </>
          ) : (
            <ThemedText type="authHeading">
              Create An Account As Patient
            </ThemedText>
          )}

          <Text style={signInStyles.grayText}>{t("sign_up_now")}</Text>
          <View style={signInStyles.inputContainers}>
            <InputComp
              placeholder={t("full_name")}
              placeHolderColor="#C2C2C2"
              keyboardType="default"
              onChangeText={handleFirstNameChange}
              value={formData.firstName}
            />
            {errors.firstName ? (
              <Text style={signInStyles.errorText}>{errors.firstName}</Text>
            ) : null}

            <InputComp
              placeholder={t("email")}
              placeHolderColor="#C2C2C2"
              keyboardType="email-address"
              onChangeText={handleEmailChange}
              value={formData.email}
            />
            {errors.email ? (
              <Text style={signInStyles.errorText}>{errors.email}</Text>
            ) : null}

            <PassComp
              placeholder={t("password")}
              placeHolderColor="#C2C2C2"
              password={true}
              onChangeText={handlePasswordChange}
              value={formData.password}
            />
            {errors.password ? (
              <Text style={signInStyles.errorText}>{errors.password}</Text>
            ) : null}

            <PassComp
              placeholder={t("reenter_password")}
              placeHolderColor="#C2C2C2"
              password={true}
              onChangeText={handleConfirmPasswordChange}
              value={formData.confirmPassword}
            />
            {errors.confirmPassword ? (
              <Text style={signInStyles.errorText}>
                {errors.confirmPassword}
              </Text>
            ) : null}
            {accloading ? (
              <ActivityIndicator size="small" color="#107ACA" />
            ) : (
              <CustomButton
                style={signInStyles.loginbtn}
                onPress={
                  () =>
                    HandelSignup(
                      formData.email,
                      formData.password,
                      role,
                      formData.firstName
                    )
                  // navigation.navigate("auth/signup/RegisterScreen")
                }
              >
                <Text style={RegAsStyles.text}>{t("sign_up")}</Text>
              </CustomButton>
            )}

            <View style={signInStyles.Orcontainer}>
              <View style={signInStyles.line} />
              <Text style={signInStyles.text}>{t("or_sign_in_with")}</Text>
              <View style={signInStyles.line} />
            </View>
            <View style={signInStyles.bottomContainee}>
              <CustomButton
                style={signInStyles.googlebtn}
                onPress={() => {
                  if (role) {
                    googleSignUp(role);
                  } else {
                    googleSignUp(role?.role);
                  }
                }}
              >
                <GoogleSvg />
              </CustomButton>
              <Text style={signInStyles.botGray}>
                {t("by_logging")}, {t("agree")}
                <Text style={signInStyles.botblack}>
                  {t("terms_conditions")}{" "}
                </Text>
                {t("and")}
                <Text style={signInStyles.botblack}>
                  {" "}
                  {t("privacy_policy")}.
                </Text>
              </Text>
              <View style={signInStyles.bottomBtn}>
                <Text style={signInStyles.botblack}>
                  {t("already_have_account")}
                </Text>
                <CustomButton
                  style={signInStyles.btn}
                  onPress={() => navigation.navigate("auth/signin/index")}
                >
                  <Text style={signInStyles.botblue}>{t("sign_in")}</Text>
                </CustomButton>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
