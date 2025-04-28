import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
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
import { InputCompStyles } from "@/Styles/InputCompStyles";
import { responsiveHeight } from "react-native-responsive-dimensions";
import useRegClinic from "@/hooks/useRegClinic";
import useRegisterClinic from "@/hooks/useRegisterClinic";

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
    pickPDF,
    handleUploadPDF
    
  } = useRegisterClinic();
  const { t } = useTranslation();
  const { toast } = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {toast && (
        <DynamicToast
          text={toast.text}
          heading={toast.heading}
          bgColor={toast.type === "success" ? "white" : "red"}
        />
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={DoctorStyles.Maincontainer}>
          <TopContainer title="Add Clinic" onPress={handleBackPress} />
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
            <ThemedLabelText type="primary">Clinic Name</ThemedLabelText>
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
            <ThemedLabelText type="primary">{t("ph_num")}</ThemedLabelText>
            <InputComp
              placeholder="XXXXXXXX"
              placeHolderColor="#C2C2C2"
              keyboardType="phone-pad"
              onChangeText={(text: string) => handlePhoneChange(text)}
              value={formData.ph_num}
            />
            {/* {errors.docName ? (
              <Text style={signInStyles.errorText}>{errors.docName}</Text>
            ) : null} */}
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

            <ThemedLabelText type="primary" style={{marginBottom:responsiveHeight(1)}}>
              Upload Contract
            </ThemedLabelText>
            <Pressable style={InputCompStyles.input2} onPress={pickPDF}>
              <Text>+Upload Contract</Text>
            </Pressable>

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
