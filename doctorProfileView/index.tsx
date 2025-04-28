import { View, Text, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { MyAppointmentsStyles } from "@/Styles/MyAppointmentsStyles";
import ProfileSettingcontainer from "@/components/ProfileSettingcontainer";
import { UseSettingData } from "@/Data/UseSettingData";
import { UseProfileSettingData } from "@/Data/UseProfileSettingData";
import ProfileSettingNav from "@/Navigation/ProfileSettingNav";
import { HistoryStyles } from "@/Styles/HistoryStyles";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { useRoute } from "@react-navigation/native";
import { PatientAppointConatinerStyles } from "@/Styles/PatientAppointConatinerStyles";
import { DoctorInfoContinerstyles } from "@/Styles/DoctorInfoContinerStyles";
import { Entypo } from "@expo/vector-icons";
import { ProfileViewStyles } from "@/Styles/ProfileViewStyles";
import DocterDashboardHook from "@/hooks/DocterDashboardHook";
import MainModal from "@/Modal/MainModal";
import { Calendar } from "react-native-calendars";
import Modalstyles from "@/Styles/Modal";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import useUpdateAppointment from "@/hooks/useUpdateAppointment";
export default function PatientProfileView() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const route = useRoute();
  const item = route.params as any;
  console.log("itme:  ", item);
  const { open, close, modal } = DocterDashboardHook();
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null
  );
  const { updateAppointmentStatus } = useUpdateAppointment();
  //   const { updateAppointmentStatus } = useGetAppointments();
  // const times = ["08:30 AM", "09:30 AM", "10:30 AM", "11:30 AM"];
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title="Patient Profile" onPress={handleBackPress} />
          <View style={LanguageScreenSttyles.container}>
            <View style={ProfileViewStyles.mainConatiner}>
              <View style={ProfileViewStyles.main}>
                <Image
                  source={{ uri: item.item.image }}
                  style={PatientAppointConatinerStyles.docImg}
                />
                <View>
                  <Text
                    style={[
                      ProfileViewStyles.Status,
                      item.item.status === "Cancelled"
                        ? ProfileViewStyles.redStatus
                        : null,
                    ]}
                  >
                    Appointment {item.item.status}
                  </Text>

                  <CustomButton style={ProfileViewStyles.locationbtn}>
                    <Entypo name="location-pin" size={18} color="#107ACA" />
                    <Text style={ProfileViewStyles.locationbtntxt}>
                      {item.item.location}
                    </Text>
                  </CustomButton>
                  <ThemedText type="primaryHeading">
                    {item.item.patientName}
                  </ThemedText>
                  <View
                    style={[
                      DoctorInfoContinerstyles.status,
                      DoctorInfoContinerstyles.margin,
                    ]}
                  >
                    <ThemedText type="patText">{item.item.date}</ThemedText>
                    <ThemedText type="patText"> |</ThemedText>
                    <ThemedText type="patText"> {item.item.time} </ThemedText>
                  </View>
                  <View
                    style={[
                      DoctorInfoContinerstyles.status,
                      DoctorInfoContinerstyles.margin,
                    ]}
                  >
                    <ThemedText type="patText">
                      Gender: {item.item.gender}
                    </ThemedText>
                    <ThemedText type="patText"> </ThemedText>
                    {/* <ThemedText type="patText">
                      {" "}
                      Age: {item.item.age}{" "}
                    </ThemedText> */}
                  </View>
                  <ThemedText type="bluetext">
                    {" "}
                    {item.item.patientPhone}
                  </ThemedText>
                </View>
              </View>
            </View>
            <View style={ProfileViewStyles.mainConatiner}>
              <Text style={ProfileViewStyles.des}>Description</Text>
              <Text style={ProfileViewStyles.destext}>
                {item.item.patientDesc}
              </Text>
              {item.item.status !== "Cancelled" && (
                <View style={PatientAppointConatinerStyles.btnconatiner}>
                  <CustomButton
                    style={PatientAppointConatinerStyles.simplebtn}
                    onPress={() =>
                      updateAppointmentStatus(item.item.id, "cancel", item.item)
                    }
                  >
                    <Text style={PatientAppointConatinerStyles.locationbtntxt}>
                      Cancel Appointment
                    </Text>
                  </CustomButton>
                  <CustomButton
                    style={PatientAppointConatinerStyles.btn}
                    onPress={open}
                  >
                    <Text style={PatientAppointConatinerStyles.locationbtntxt}>
                      Reschedule
                    </Text>
                  </CustomButton>
                  <CustomButton
                    style={PatientAppointConatinerStyles.filledbtn}
                    onPress={() =>
                      updateAppointmentStatus(
                        item.item.id,
                        item.item.status === "pending"
                          ? "Accepted"
                          : "Completed",
                        item.item
                      )
                    }
                  >
                    <Text style={PatientAppointConatinerStyles.btnTxt}>
                      {item.item.status === "pending" ? "Accept" : "Completed"}
                    </Text>
                  </CustomButton>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <MainModal open={modal} close={close}>
        <View style={Modalstyles.modal}>
          <ThemedText type="SecLightHeading">Select Date</ThemedText>
          <Calendar
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
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
          <ThemedText type="SecLightHeading">Available time</ThemedText>

          <CustomButton style={Modalstyles.nextbtn} onPress={close}>
            <Text style={RegAsStyles.text}>Done</Text>
          </CustomButton>
        </View>
      </MainModal>
    </View>
  );
}
