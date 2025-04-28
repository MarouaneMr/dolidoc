import {
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
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
import useUpdateUser from "@/hooks/useUpdateUser";
import useLocation from "@/hooks/useLocation";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
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
  const currentYear: number = new Date().getFullYear();
  const [step, setStep] = useState("year"); // Steps: 'year', 'month', 'date'
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);

  // Generate a list of years (e.g., from 1920 to current year)
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // List of months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const { onGoogleButtonPress, signOut } = useGoogleCalendar();
  const { t } = useTranslation();
  
  const {
    // selectedDate,
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
  } = useUpdateUser();
  const { toast } = useToast();

useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


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
                  source={
                    formData?.image
                      ? { uri: formData?.image }
                      : require("../../../assets/images/profile.png")
                  }
                  style={ProfileImageStyles.emptyProfileImage}
                />
              )}
              <Pressable onPress={pickImage} style={ProfileImageStyles.camera}>
                <EditSvg />
              </Pressable>
            </View>
            {errors.image && (
              <Text style={AppointmentStyles.errorText}>{errors.image}</Text>
            )}
            <View style={AppointmentStyles.inputSectStyle}>
              <View style={AppointmentStyles.iconContainer}>
                
                <Image
                  source={require("../../../assets/images/User-Outline.png")}
                  style={AppointmentStyles?.imageStyle}
                />
                
              </View>
              <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder={t("enterYourName")}
                value={formData?.name}
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
                  style={AppointmentStyles?.imageStyle}
                />
              </View>
              <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder="Enter Phone Number"
                keyboardType="number-pad"
                value={formData?.phone}
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
                  style={AppointmentStyles?.imageStyle}
                />
              </View>
              {/* <TextInput
                    underlineColor="none"
                    style={AppointmentStyles.textInputStyle}
                    placeholder={t("Gender")}
                    value={formData?.gender}
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
                  value={formData?.gender}
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
                  style={AppointmentStyles?.imageStyle}
                />
              </View>
              <TouchableOpacity
                style={AppointmentStyles.DobBtn}
                onPress={() => setCalendarVisible(true)}
              >
                <Text>{selectedDate ? selectedDate :formData?.dateOfBirth ?  formData?.dateOfBirth: t("dateOfBirth")}</Text>
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
                  style={AppointmentStyles?.imageStyle}
                />
              </View>
              <TextInput
                underlineColor="none"
                style={AppointmentStyles.textInputStyle}
                placeholder={t("address")}
                value={formData?.address}
                onChangeText={(value) => handleInputChange("address", value)}
              />
            </View>
            {errors.address && (
              <Text style={AppointmentStyles.errorText}>{errors.address}</Text>
            )}
            {/* <View style={AppointmentStyles.inputSectStyle}>
              <TextInput
                style={AppointmentStyles.textInputStyle}
                multiline
                numberOfLines={10}
                placeholder={t("description")}
                value={formData?.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
              />
            </View>
            {errors.description && (
              <Text style={AppointmentStyles.errorText}>
                {errors.description}
              </Text>
            )} */}
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
              style={AppointmentStyles.signOut}
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
          {/* <MainModal
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
          </MainModal> */}
          <MainModal open={isCalendarVisible} close={()=>setCalendarVisible(false)}>
      <View style={[DocterDashboardStyles.modal,step === "year" && {height:responsiveHeight(60)}]}>
        <CustomButton onPress={()=>setCalendarVisible(false)} style={AppointmentStyles.calBtn}>
          <CrossSvg />
        </CustomButton>

        {/* Step 1: Select Year */}
        {step === "year" && (
          <>
            <Text style={{color:"#247CFF", textAlign: "center", fontSize:  responsiveFontSize(3), marginBottom: responsiveHeight(2) }}>Select Year</Text>
            <FlatList
              data={years}
              numColumns={3}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ alignItems: "center",width: "33%",padding:responsiveWidth(2) }}
                  onPress={() => {
                    setSelectedYear(item);
                    setStep("month");
                  }}
                >
                  <Text style={{ fontSize: responsiveFontSize(2) }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Step 2: Select Month */}
        {step === "month" && (
          <>
            <Text style={{color:"#247CFF", textAlign: "center", fontSize:  responsiveFontSize(3), marginBottom: responsiveHeight(2) }}>Select Month</Text>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              numColumns={3}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{ padding: 10, width: "33%", alignItems: "center" }}
                  onPress={() => {
                    setSelectedMonth(index + 1);
                    setStep("date");
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Step 3: Select Date */}
        {step === "date" && selectedYear && selectedMonth && (
          <>
            <Text style={{color:"#247CFF", textAlign: "center",fontSize:  responsiveFontSize(3), marginBottom: responsiveHeight(2) }}>Select Date</Text>
            <Calendar
              current={`${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-01`}
              onDayPress={(day: { dateString: any; }) => {
                const fullDate = day.dateString; // YYYY-MM-DD format
                setSelectedDate(fullDate);
                handleDateSelect(fullDate); // Send date to parent function
                // onclose();
                setCalendarVisible(false);
              }}
              markedDates={{ [selectedDate || ""]: { selected: true } }}
            />
          </>
        )}
      </View>
    </MainModal>
        </ScrollView>
      </View>
    </View>
  );
}
