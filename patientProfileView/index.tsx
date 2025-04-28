import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
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
import useGetAppointments from "@/hooks/useGetAppointments";
export default function PatientProfileView() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const route = useRoute();
  const item = route.params as any;
  const {
    open,
    close,
    modal,
    cancelmodal,
    opencancelModal,
    closeCancel,
    // id,
    availableSlots,
    handleDateSelect,
    setModal,
    fetchAvailabilitySchedule,
    selectedTimeIndex,
    setSelectedTimeIndex,
    isLoading,
    saveAppointment,
    setSelectedTimeSlot,
    onDateSelect,
  } = DocterDashboardHook();

  const { updateAppointmentStatus } = useGetAppointments();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title="Doctor Profile" onPress={handleBackPress} />
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
                    {item.item.name}
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
                  <ThemedText type="bluetext"> {item?.item?.phone}</ThemedText>
                </View>
              </View>
            </View>
            <View style={ProfileViewStyles.mainConatiner}>
              <Text style={ProfileViewStyles.des}>Description</Text>
              <Text style={ProfileViewStyles.destext}>{item?.item?.desc}</Text>
              <View style={PatientAppointConatinerStyles.btnconatiner}>
                <CustomButton
                  style={PatientAppointConatinerStyles.simplebtn}
                  onPress={() =>
                    updateAppointmentStatus(
                      item.item.id,
                      "Cancelled",
                      item.item
                    )
                  }
                >
                  <Text style={PatientAppointConatinerStyles.locationbtntxt}>
                    Cancel Appointment
                  </Text>
                </CustomButton>
                <CustomButton
                  style={PatientAppointConatinerStyles.btn}
                  onPress={() => {
                    setModal(true);
                    fetchAvailabilitySchedule(item.doctorUid);
                  }}
                >
                  <Text style={PatientAppointConatinerStyles.locationbtntxt}>
                    Reschedule
                  </Text>
                </CustomButton>
                <View style={PatientAppointConatinerStyles.filledbtn}>
                  <Text style={PatientAppointConatinerStyles.btnTxt}>
                    {item.item.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <MainModal open={modal} close={close}>
        <ScrollView style={Modalstyles.modal}>
          <ThemedText type="SecLightHeading">Select Date</ThemedText>
          <Calendar
            onDayPress={(day) => {
              handleDateSelect(day.dateString);
              onDateSelect(day.dateString);
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#247CFF",
              dayTextColor: "#2d4150",
            }}
          />
          <ThemedText type="SecLightHeading">Available Time</ThemedText>
          <FlatList
            data={availableSlots}
            renderItem={({ item, index }) => (
              <CustomButton
                style={[
                  DocterDashboardStyles.Timebtn,
                  selectedTimeIndex === index && { backgroundColor: "#247CFF" },
                ]}
                onPress={() => {
                  setSelectedTimeIndex(index);
                  setSelectedTimeSlot(item);
                }}
              >
                <Text
                  style={[
                    DocterDashboardStyles.Time,
                    selectedTimeIndex === index && { color: "white" },
                  ]}
                >
                  {item}
                </Text>
              </CustomButton>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
          {isLoading && <ActivityIndicator color={"#107ACA"} />}
          <View style={Modalstyles.btnView}>
            <CustomButton style={Modalstyles.cancelButton} onPress={close}>
              <Text style={RegAsStyles.text2}>Cancel</Text>
            </CustomButton>
            <CustomButton
              style={Modalstyles.nextbtn}
              onPress={() => saveAppointment(item)}
            >
              <Text style={RegAsStyles.text}>Done</Text>
            </CustomButton>
          </View>
        </ScrollView>
      </MainModal>
    </View>
  );
}
