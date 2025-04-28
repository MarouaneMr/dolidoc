import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { signInStyles } from "@/Styles/signInStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import RegisterStepOne from "./RegisterStepOne";
import DateTimePicker from "@react-native-community/datetimepicker";
import RegisterStepTwo from "./RegisterStepTwo";
import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import BackSvg from "@/Svg/BackSvg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useRoute } from "@react-navigation/native";
import RegisterHook from "@/hooks/useDoctorProfile";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import InputComp from "@/components/InputComp";
import { Specs } from "@/Data/Specs";
import { ProfileImageStyles } from "@/Styles/ProfileImageStyles";
import EditSvg from "@/Svg/EditSvg";
import MultiSelect from "react-native-multiple-select";
import RNPickerSelect from "react-native-picker-select";
import CheckboxComp from "@/components/CheckboxComp";
import { ActivityIndicator } from "react-native-paper";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import PassComp from "@/components/PassComp";
import SignUpHook from "@/hooks/SignUpHook";
import useRegClinic from "@/hooks/useRegClinic";
import { AvailabilityScheduleStyles } from "@/Styles/AvailabilityScheduleStyles";

export default function ClinicRegister() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { SpecData, ClinicSpec } = Specs();

  const {
    image,
    pickImage,
    backPress,
    currentStep,
    place,
    location,
    formData,
    selectedSpecs,
    handleFormSubmit,
    handleSpecsChange,
    handleInfoSubmit,
    handleChange,
    isLoading,
    formErrors,
    handlePasswordChange,
    handleConfirmPasswordChange,
    errors,
    isTimePickerVisible,
    showCustomTimePicker,
    onTimeChange,
    endTime,
    startTime,
  } = useRegClinic();
  const selector = useSelector(authSelector);
  // console.log("sec selector: ", selector);
  const { toast } = useToast();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {toast && (
        <DynamicToast
          text={toast.text}
          heading={toast.heading}
          // bgColor={toast.type === "success" ? "white" : "red"}
        />
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={signInStyles.Maincontainer}>
          <CustomButton
            style={RegisterScreenStyles.backbtn}
            onPress={backPress}
          >
            <BackSvg />
          </CustomButton>
          <ThemedText type="authHeading">
            {t("complete_profile_to_join")}
          </ThemedText>
          <Text style={signInStyles.grayText}>{t("complete_profile_now")}</Text>

          <>
            <View style={signInStyles.inputContainers}>
              <View style={ProfileImageStyles.Container}>
                <View style={ProfileImageStyles.profilecontainer}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={ProfileImageStyles.profileimage}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/images/profile.png")}
                      style={ProfileImageStyles.emptyProfileImage}
                    />
                  )}
                  <Pressable
                    onPress={pickImage}
                    style={ProfileImageStyles.camera}
                  >
                    <EditSvg />
                  </Pressable>
                </View>

                {formErrors.image && (
                  <Text style={RegisterScreenStyles.errorimg}>
                    {formErrors.image}
                  </Text>
                )}
              </View>

              <ThemedLabelText type="primary">
                {t("clinic_name")}
              </ThemedLabelText>
              <InputComp
                placeholder={t("clinic_name")}
                placeHolderColor="#C2C2C2"
                keyboardType="default"
                //   value={selector.name}
                onChangeText={(text: string) =>
                  handleChange("clinic_name", text)
                }
              />
              {formErrors.clinic_name && (
                <Text style={RegisterScreenStyles.errorText}>
                  {formErrors.clinic_name}
                </Text>
              )}
              <ThemedLabelText type="primary">{t("Email")}</ThemedLabelText>
              <InputComp
                placeholder={t("Email")}
                placeHolderColor="#C2C2C2"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text: string) => handleChange("email", text)}
              />
              {formErrors.email && (
                <Text style={RegisterScreenStyles.errorText}>
                  {formErrors.email}
                </Text>
              )}
              <ThemedLabelText type="primary">{t("password")}</ThemedLabelText>
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
              <ThemedLabelText type="primary">
                {t("reenter_password")}
              </ThemedLabelText>
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

              <ThemedLabelText type="primary">{t("ph_num")}</ThemedLabelText>
              <InputComp
                placeholder={t("ph_num")}
                placeHolderColor="#C2C2C2"
                keyboardType="phone-pad"
                onChangeText={(text: string) =>
                  handleChange("Phone_number", text)
                }
                value={formData.phone_number}
              />
              {formErrors.phone_number && (
                <Text style={RegisterScreenStyles.errorText}>
                  {formErrors.phone_number}
                </Text>
              )}

              <ThemedLabelText type="primary">
                {t("clinic_disc")}
              </ThemedLabelText>
              <View style={RegisterScreenStyles.dropdown}>
                <RNPickerSelect
                  onValueChange={(value) => handleSpecsChange(value)}
                  items={ClinicSpec}
                  placeholder={{
                    label: t("clinic_disc"),
                    value: null,
                  }}
                  style={{
                    inputIOS: RegisterScreenStyles.inputIOS,
                    inputAndroid: RegisterScreenStyles.inputAndroid,
                    iconContainer: RegisterScreenStyles.iconContainer,
                  }}
                  value={selectedSpecs}
                />
              </View>
              {formErrors.specialization && (
                <Text style={RegisterScreenStyles.errorText}>
                  {formErrors.specialization}
                </Text>
              )}
              <ThemedLabelText type="primary">
                {t("Select Location")}
              </ThemedLabelText>
              <InputComp
                placeholder={t("Add Location")}
                placeHolderColor="#C2C2C2"
                keyboardType="default"
                style={RegisterScreenStyles.locationinput}
                value={place}
                onChangeText={() => handleChange("location", location)}
              />
              <ThemedLabelText type="primary">
                {t("Your Availability")}
              </ThemedLabelText>
              <ThemedLabelText type="primary">{t("days")}</ThemedLabelText>
              <InputComp
                placeholder={t("days")}
                placeHolderColor="#C2C2C2"
                keyboardType="default"
                value={formData.days}
                onChangeText={(text: string) => handleChange("days", text)}
              />
              {formErrors.days && (
                <Text style={RegisterScreenStyles.errorText}>
                  {formErrors.days}
                </Text>
              )}
              <View
                style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
              >
                <Pressable
                  style={RegisterScreenStyles.pressableButton}
                  onPress={() => showCustomTimePicker(true)}
                >
                  <Text>{startTime || "Start"}</Text>
                </Pressable>

                <Text style={AvailabilityScheduleStyles.timeSeparator}>-</Text>

                <Pressable
                  style={RegisterScreenStyles.pressableButton}
                  onPress={() => showCustomTimePicker(false)}
                >
                  <Text>{endTime || "End"}</Text>
                </Pressable>
              </View>
              {/* <CustomButton
                  style={RegisterScreenStyles.syncbtn}
                  onPress={() => promptAsync()}
                >
                  <Text style={RegisterScreenStyles.text}>
                    {isSyncing
                      ? "Syncing..."
                      : account
                      ? `Synced with ${account}`
                      : t("+Sync Your Google Calendar")}
                  </Text>
                </CustomButton> */}
            </View>
          </>
        </View>
        {isTimePickerVisible && (
          <DateTimePicker
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            value={new Date()}
            onChange={onTimeChange}
          />
        )}

        <View style={{ marginBottom: responsiveHeight(4) }}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#107ACA"
              style={{ marginBottom: responsiveHeight(3) }}
            />
          ) : (
            <CustomButton
              style={RegisterScreenStyles.nextbtn}
              // onPress={() => navigation.navigate("auth/signup/SuccessScreen")}
              onPress={() => handleInfoSubmit()}
            >
              <Text style={RegAsStyles.text}>{t("submit")}</Text>
            </CustomButton>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
