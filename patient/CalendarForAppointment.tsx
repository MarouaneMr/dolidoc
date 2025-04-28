import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Modalstyles from "@/Styles/Modal";
import { ThemedText } from "@/components/ThemedText";
import { Calendar } from "react-native-calendars";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import CustomButton from "@/components/CustomButton";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useTranslation } from "react-i18next";
import TopContainer from "@/components/TopContainer";
import { useNavigation, useRouter } from "expo-router";
import BackSvg from "@/Svg/BackSvg";
import AntDesign from "@expo/vector-icons/AntDesign";
import CalendarsStyles from "@/Styles/PatientSideCalendarStyling";
import { IndexStyles } from "@/Styles/AboutIndexStyles";
import { useRoute } from "@react-navigation/native";
import useCalenderHook from "@/hooks/CalenderHook";
import useBookAppointment from "@/hooks/useBookAppointment";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import moment from "moment";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import SelectRole from "../auth/role/SelectRole";
// import useFetchUser from "@/hooks/useFetchUser";

export default function Calendars() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { doctor } = route.params as any; 
  const handleDayPress = (day: any) => {
    setMarkedDates((prev) => {
      // Reset styles to the originally marked dates
      const resetMarkedDates = getMarkedDates(
        doctor?.availablility_schedule?.workingHours || [],
        doctor?.availablility_schedule?.customDates || []
      );
  
      return {
        ...resetMarkedDates, // Restore original marked dates
        [day.dateString]: {
          ...(resetMarkedDates[day.dateString] || {}), // Preserve any existing styles
          // selected: true,
          // selectedColor: "#247CFF",
          customStyles: {
            container: {
              borderWidth: 2,
              borderColor: "green",
              borderRadius: 8, // Optional for rounded corners
            },
          },
        },
      };
    });
  };
// Function to generate marked dates
const getMarkedDates = (workingHours: any[], customDates: any[]) => {
  let markedDates: Record<string, any> = {};

  // Get today's date
  const today = moment();

  // Mark all occurrences of checked weekdays
  workingHours.forEach((dayObj) => {
    if (dayObj.meta.checked) {
      const dayIndex = moment().isoWeekday(dayObj.day).isoWeekday(); // Get index of the weekday

      // Loop through the next 3 months to mark all occurrences
      for (let i = 0; i < 90; i++) {
        let date = today.clone().add(i, "days");
        if (date.isoWeekday() === dayIndex) {
          markedDates[date.format("YYYY-MM-DD")] = {
            selected: true,
            selectedColor: "#247CFF",
          };
        }
      }
    }
  });

  // Mark custom dates if provided
  customDates.forEach((customDate) => {
    const dateString = customDate.date; // Assuming the date format is "YYYY-MM-DD"
    markedDates[dateString] = {
      selected: true,
      selectedColor: "#247CFF",
    };
  });

  return markedDates;
};
  // console.log("Doctor details: ",doctor);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>(
    getMarkedDates(
      doctor?.availablility_schedule?.workingHours || [],
      doctor?.availablility_schedule?.customDates || []
    )
  );
  
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const {user} =useSelector(authSelector);
  const {
    handleDateSelect,
    selectedTimeIndex,
    setSelectedTimeIndex,
    availableSlots,
    loading,
  } = useCalenderHook(doctor);

  const { setSelectedTimeSlot, onDateSelect, saveAppointment,loading:appLoading } =
    useBookAppointment({ doctor });

  const { toast } = useToast();
  return (
    <View style={{ flex: 1 }}>
      {toast && (
        <DynamicToast
          text={toast.text}
          heading={toast.heading}
          // bgColor={toast.type==="success"?"white":"red"}
        />
      )}

      <Progress loading={loading|| appLoading} />

      {/* <DynamicToast text={"toast.text"} heading="Success" bgColor="white" /> */}
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView>

          <View style={CalendarsStyles.headerContainer}>
            <AntDesign
              onPress={() => navigation.goBack()}
              style={CalendarsStyles.backButton}
              name="leftsquareo"
              size={22}
              color="white"
            />
            <View style={{}}>
              <ThemedText
                type="primaryHeading"
                style={CalendarsStyles.headingText}
              >
                {t("book_appointment")}
              </ThemedText>
              {/* <Text style={CalendarsStyles.subHeadingText}>{workingHours}</Text> */}
            </View>
          </View>

          {/* {isLoading && <ActivityIndicator color={"#107ACA"} />} */}
          <View style={CalendarsStyles.sectionContainer}>
            <ThemedText
              type="SecLightHeading"
              style={CalendarsStyles.sectionTitle}
            >
              {t("select_date")}
            </ThemedText>
            <View style={CalendarsStyles.calendarContainer}>
              <Calendar
                minDate={moment().format("YYYY-MM-DD")}
                onDayPress={(day: any) => {
                  handleDateSelect(day.dateString);
                  onDateSelect(day.dateString);
                  handleDayPress(day);
                }}
                markedDates={markedDates}
                markingType="custom"
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: "#b6c1cd",
                  textSectionTitleDisabledColor: "#d9e1e8",
                  selectedDayBackgroundColor: "#247CFF",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#247CFF",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  dotColor: "#00adf5",
                  selectedDotColor: "#ffffff",
                  arrowColor: "#247CFF",
                  disabledArrowColor: "#d9e1e8",
                  monthTextColor: "#247CF",
                  indicatorColor: "#247CF",
                }}
              />
            </View>

            <ThemedText
              type="SecLightHeading"
              style={CalendarsStyles.sectionTitle}
            >
              {t("available_time")}
            </ThemedText>
            <View>
              <FlatList
                data={availableSlots}
                renderItem={({ item, index }) => (
                  <CustomButton
                    style={[
                      CalendarsStyles.timeButton,
                      selectedTimeIndex === index &&
                        CalendarsStyles.selectedTimeButton,
                    ]}
                    onPress={() => {
                      setSelectedTimeIndex(index);
                      setSelectedTimeSlot(item);
                    }}
                  >
                    <Text
                      style={[
                        CalendarsStyles.timeText,
                        selectedTimeIndex === index &&
                          CalendarsStyles.selectedTimeText,
                      ]}
                    >
                      {`${item?.start} - ${item?.end}`}
                    </Text>
                  </CustomButton>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
        <View style={IndexStyles.buttonContainer}>
          <CustomButton
            style={RegAsStyles.continuebtn}
            // onPress={() => navigation.navigate("patient/appntnt/index")}
            onPress={() =>{
            if(!user){
              navigation.navigate("Profile");
            }
            else{
            if(selectedTimeIndex==null){
              return;
            }else{
              saveAppointment(doctor?.user_id);
              
            }
              }
              }
              }
          >
            <Text style={RegAsStyles.text}>{t("next")}</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
}
