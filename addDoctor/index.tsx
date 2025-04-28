import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React from "react";
import DoctorStyles from "@/Styles/DoctorStyles";
import TopContainer from "@/components/TopContainer";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import useRegCliDoc from "@/hooks/useRegCliDoc";
import InputComp from "@/components/InputComp";
import { signInStyles } from "@/Styles/signInStyles";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import PassComp from "@/components/PassComp";
import CustomButton from "@/components/CustomButton";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";

export default function index() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const {
    handleConfirmPasswordChange,
    handleEmailChange,
    handleFirstNameChange,
    handlePasswordChange,
    errors,
    formData,
    isLoading,
    handleSubmit,
    handlePhoneChange,
  } = useRegCliDoc();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {toast && (
        <DynamicToast
          text={toast.text}
          heading={toast.heading}
          bgColor={toast.type === "success" ? "white" : "red"}
          type={toast.type}
        />
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={DoctorStyles.Maincontainer}>
          <TopContainer title={t("doctors")} onPress={handleBackPress} />
          <View style={DoctorStyles.secCont}>
            <ThemedLabelText type="primary">{t("Email")}</ThemedLabelText>
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
            <ThemedLabelText type="primary">{t("doctor")}</ThemedLabelText>
            <InputComp
              placeholder={t("name")}
              placeHolderColor="#C2C2C2"
              keyboardType="email-address"
              onChangeText={handleFirstNameChange}
              value={formData.docName}
            />
            {errors.docName ? (
              <Text style={signInStyles.errorText}>{errors.docName}</Text>
            ) : null}
            <ThemedLabelText type="primary">{t("phone")}</ThemedLabelText>
            <InputComp
              placeholder="XXXXXXXX"
              placeHolderColor="#C2C2C2"
              keyboardType="phone-pad"
              onChangeText={(text: string) => handlePhoneChange(text)}
              value={formData.phone}
            />
            {errors.phone ? (
              <Text style={signInStyles.errorText}>{errors.phone}</Text>
            ) : null}
            <ThemedLabelText type="primary">
              {t("password_placeholder")}
            </ThemedLabelText>
            <PassComp
              placeholder="*****"
              placeHolderColor="#C2C2C2"
              password={true}
              onChangeText={handlePasswordChange}
              value={formData.password}
            />

            {errors.password ? (
              <Text style={signInStyles.errorText}>{errors.password}</Text>
            ) : null}
            <ThemedLabelText type="primary">
              {t("confirm_placeholder")}
            </ThemedLabelText>
            <PassComp
              placeholder="*****"
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
            {isLoading ? (
              <ActivityIndicator size="small" color="#107ACA" />
            ) : (
              <CustomButton
                style={signInStyles.loginbtn}
                onPress={() => handleSubmit()}
              >
                <Text style={RegAsStyles.text}>{t("register")}</Text>
              </CustomButton>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
