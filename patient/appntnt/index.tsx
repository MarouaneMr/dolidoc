import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { AppointmentStyles } from "@/Styles/AppointmentStyles";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import useProfileImage from "@/hooks/ProfileImage";
import { ProfileImageStyles } from "@/Styles/ProfileImageStyles";
import EditSvg from "@/Svg/EditSvg";
import { Calendar } from "react-native-calendars";
import CrossSvg from "@/Svg/CrossSvg";
import PersonalInfoHook from "@/hooks/PersonalInfoHook";
import MainModal from "@/Modal/MainModal";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import useGoogleCalendar from "@/hooks/useGoogleCalendar";
import { useCheckUser } from "@/hooks/checkUser";
import useGetAppointments from "@/hooks/useGetAppointments";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
interface DayObject {
  day: number;
  month: number;
  year: number;
  timestamp: number;
  dateString: string;
}

export default function index() {
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { onGoogleButtonPress, signOut } = useGoogleCalendar();
  const { t } = useTranslation();
  const {
    selectedDate,
    handleDateSelect,
    isCalendarVisible,
    setCalendarVisible,
    image,
    pickImage,
    formData,
    handleInputChange,
    uploadImageAndSaveFormData,
    isLoading,
    errors,
  } = PersonalInfoHook();
  const { toast } = useToast();
  let user;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {toast && (
          <DynamicToast
            text={toast.text}
            heading={toast.heading}
            type={toast.type}
          />
        )}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={AppointmentStyles.Maincontainer}>
            <TopContainer title={t("title")} onPress={backPress} />

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
              <Pressable onPress={pickImage} style={ProfileImageStyles.camera}>
                <EditSvg />
              </Pressable>
            </View>
            <View style={AppointmentStyles.inputSectStyle}>
              <View style={AppointmentStyles.iconContainer}>
                <Image
                  source={require("../../../assets/images/User-Outline.png")}
                  style={AppointmentStyles.imageStyle}
                />
              </View>
              <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder={t("enterYourName")}
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
              />
            </View>
            {errors.name && (
              <Text style={AppointmentStyles.errorText}>{errors.name}</Text>
            )}
            <View style={AppointmentStyles.inputSectStyle}>
              <View style={AppointmentStyles.iconContainer}>
                <Image
                  source={require("../../../assets/images/Phone Rounded.png")}
                  style={AppointmentStyles.imageStyle}
                />
              </View>
              <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder="0339458498495"
                keyboardType="number-pad"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
              />
            </View>
            {errors.phone && (
              <Text style={AppointmentStyles.errorText}>{errors.phone}</Text>
            )}

            <View style={AppointmentStyles.inputSectStyle}>
              <View style={AppointmentStyles.iconContainer}>
                <Image
                  source={require("../../../assets/images/Group (2).png")}
                  style={AppointmentStyles.imageStyle}
                />
              </View>
              {/* <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder={t("Gender")}
                value={formData.gender}
                onChangeText={(value) => handleInputChange("gender", value)}
              /> */}
              <View style={AppointmentStyles.textInputStyle}>
                <RNPickerSelect
                  onValueChange={(value) => handleInputChange("gender", value)}
                  items={[
                    { label: t("Female"), value: "Female" },
                    { label: t("Male"), value: "Male" },
                  ]}
                  placeholder={{ label: t("Gender"), value: null }}
                  style={{
                    inputIOS: RegisterScreenStyles.inputIOS,
                    inputAndroid: RegisterScreenStyles.inputAndroid,
                    iconContainer: RegisterScreenStyles.iconContainer,
                  }}
                  value={formData.gender}
                />
              </View>
            </View>
            {errors.gender && (
              <Text style={AppointmentStyles.errorText}>{errors.gender}</Text>
            )}
            <View style={AppointmentStyles.inputSectStyle}>
              <View style={AppointmentStyles.iconContainer}>
                <Image
                  source={require("../../../assets/images/calendar-date_svgrepo.com.png")}
                  style={AppointmentStyles.imageStyle}
                />
              </View>
              <TouchableOpacity
                style={AppointmentStyles.DobBtn}
                onPress={() => setCalendarVisible(true)}
              >
                <Text>{selectedDate ? selectedDate : t("dateOfBirth")}</Text>
              </TouchableOpacity>
            </View>
            {errors.dateOfBirth && (
              <Text style={AppointmentStyles.errorText}>
                {errors.dateOfBirth}
              </Text>
            )}
            <View style={AppointmentStyles.inputSectStyle}>
              <View style={AppointmentStyles.iconContainer}>
                <Image
                  source={require("../../../assets/images/calendar-date_svgrepo.com (1).png")}
                  style={AppointmentStyles.imageStyle}
                />
              </View>
              <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder={t("address")}
                value={formData.address}
                onChangeText={(value) => handleInputChange("address", value)}
              />
            </View>
            {errors.address && (
              <Text style={AppointmentStyles.errorText}>{errors.address}</Text>
            )}
            <View style={AppointmentStyles.inputSectStyle}>
              <TextInput
                style={AppointmentStyles.textInputStyle}
                multiline
                numberOfLines={10}
                placeholder={t("description")}
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
              />
            </View>
            {errors.description && (
              <Text style={AppointmentStyles.errorText}>
                {errors.description}
              </Text>
            )}
          </View>
          <View style={AppointmentStyles.bottomContainer}>
            {/* {user  && ( */}
            <CustomButton
              style={AppointmentStyles.syncSectionTouch}
              onPress={onGoogleButtonPress}
            >
              <Text style={AppointmentStyles.textStyles}>
                {t("+Sync Your Google Calendar")}
              </Text>
            </CustomButton>
            <CustomButton
              style={AppointmentStyles.syncSectionTouch}
              onPress={signOut}
            >
              <Text style={AppointmentStyles.textStyles}>Sign out</Text>
            </CustomButton>
            {/* )} */}
            {isLoading ? (
              <ActivityIndicator size="small" color="#247CFF" />
            ) : (
              <CustomButton
                style={AppointmentStyles.continuebtn}
                onPress={uploadImageAndSaveFormData}
              >
                <Text style={AppointmentStyles.text}>{t("done")}</Text>
              </CustomButton>
            )}
          </View>
          <MainModal
            open={isCalendarVisible}
            close={() => setCalendarVisible(false)}
          >
            <View style={DocterDashboardStyles.modal}>
              <CustomButton
                onPress={() => setCalendarVisible(false)}
                style={AppointmentStyles.calBtn}
              >
                <CrossSvg />
              </CustomButton>
              <Calendar
                onDayPress={(day: DayObject) =>
                  handleDateSelect(day.dateString)
                }
                markedDates={{ [selectedDate || ""]: { selected: true } }}
              />
            </View>
          </MainModal>
        </ScrollView>
      </View>
    </View>
  );
}
