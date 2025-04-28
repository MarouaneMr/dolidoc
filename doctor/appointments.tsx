import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { MyAppointmentsStyles } from "@/Styles/MyAppointmentsStyles";
import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { PatientAppointConatinerStyles } from "@/Styles/PatientAppointConatinerStyles";
import PatientAppointConatiner from "@/components/PatientAppointConatiner";
import { PatientData } from "@/Data/PatientData";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import SearchWithbgSvg from "@/Svg/SearchWithbgSvg";
import DocterDashboardHook from "@/hooks/DocterDashboardHook";
import MainModal from "@/Modal/MainModal";
import Modalstyles from "@/Styles/Modal";
import { Calendar } from "react-native-calendars";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useTranslation } from "react-i18next";
import useGetAppointments from "@/hooks/useGetAppointments";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";

export default function appointments() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null
  );
  const times = ["08:30 AM", "09:30 AM", "10:30 AM", "11:30 AM"];
  const { t } = useTranslation();
  const {user} = useSelector(authSelector);
  const[statusLoading,setStatusLoading] = useState(false);
  const {
    open,
    close,
    modal,
    cancelmodal,
    opencancelModal,
    closeCancel,
    availableSlots,
    handleDateSelect,
    id,
  } = DocterDashboardHook(user?.id);

  const {
    appointmentStatuses,
    setAppointmentStatus,
    setAppointmentStatuses,
    appointmentStatus,
    loading,
    updateAppointmentStatus,
  } = useGetAppointments();

 const filterstatuses= (item:any)=>{
  setStatusLoading(true);
    const appointmentArray = Array.isArray(appointmentStatuses) ? appointmentStatuses : Object.values(appointmentStatuses ?? {});

    setAppointmentStatuses(
      appointmentArray.filter((app: any) => String(app.id) !== String(item.id))
    );
    setStatusLoading(false);
  }
  const [Item, setItem] = useState();
  // console.log("item: ", appointmentStatuses);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title={t("my_appointment")} onPress={handleBackPress}>
            <CustomButton>
              <SearchWithbgSvg />
            </CustomButton>
          </TopContainer>
          <View style={LanguageScreenSttyles.container}>
            <View style={MyAppointmentsStyles.conatiner}>
              <CustomButton
                onPress={() => {
                  setAppointmentStatus("pending");
                  // setpendingDoc();
                }}
                style={[
                  MainScreenStyles.cont2,
                  appointmentStatus === "pending" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={
                    appointmentStatus === "pending" ? "bluetext" : "primaryText"
                  }
                >
                  {t("Upcoming")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => {
                  setAppointmentStatus("completed");
                  // setcompletedDoc();
                }}
                style={[
                  MainScreenStyles.cont2,
                  appointmentStatus === "completed" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={
                    appointmentStatus === "completed"
                      ? "bluetext"
                      : "primaryText"
                  }
                >
                  {t("completed")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => {
                  setAppointmentStatus("cancelled");
                  // setcancelledDoc();
                }}
                style={[
                  MainScreenStyles.cont2,
                  appointmentStatus === "cancelled" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={
                    appointmentStatus === "cancelled"
                      ? "bluetext"
                      : "primaryText"
                  }
                >
                  {t("cancelled")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => {
                  setAppointmentStatus("accepted");
                  // setacceptedDoc();
                }}
                style={[
                  MainScreenStyles.cont2,
                  appointmentStatus === "accepted" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={
                    appointmentStatus === "accepted"
                      ? "bluetext"
                      : "primaryText"
                  }
                >
                  {t("accepted")}
                </ThemedText>
              </CustomButton>
            </View>

            {(loading || statusLoading) && <ActivityIndicator size="large" color="#107ACA" />}

            <FlatList
              data={appointmentStatuses}
              style={PatientAppointConatinerStyles.margin}
              renderItem={({ item, index }) => (
                <PatientAppointConatiner
                  image={{ uri: item.image }}
                  status={item.status}
                  name={item.patientName}
                  time={item.time}
                  Date={item.date}
                  Age={item.Age}
                  appointment={item}
                  Gender={item.patientGender}
                  location={item.location}
                  id={item.id}
                  ProfilePress={() => {
                    navigation.navigate("doctorProfileView/index", { item });
                  }}
                  CancelClick={() => {
                    opencancelModal(item.id);
                    setItem(item);
                  }}
                  filterFunc={filterstatuses}
                  // reschedulePress={open}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              scrollEnabled={false}
              extraData={appointmentStatuses}
            />
          </View>
        </View>
      </ScrollView>

      <MainModal open={modal} close={close}>
        <View style={Modalstyles.modal}>
          <ThemedText type="SecLightHeading">Select Date</ThemedText>
          <Calendar
            onDayPress={(day) => handleDateSelect(day.dateString)}
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
                onPress={() => setSelectedTimeIndex(index)}
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
          <CustomButton style={Modalstyles.nextbtn} onPress={close}>
            <Text style={RegAsStyles.text}>Done</Text>
          </CustomButton>
        </View>
      </MainModal>

      <MainModal open={cancelmodal} close={closeCancel}>
        <View style={DocterDashboardStyles.modal}>
          <ThemedText type="SecLightHeading">
            Are You Sure Want You To Cancel This Appointment?
          </ThemedText>
          <View style={DocterDashboardStyles.btnConatiner}>
            <CustomButton
              style={DocterDashboardStyles.yesbtn}
              onPress={async() => {
               await updateAppointmentStatus(id, "cancelled", Item);
               await filterstatuses(Item);
                closeCancel();
              }}
            >
              <Text style={DocterDashboardStyles.yestext}>Yes</Text>
            </CustomButton>
            <CustomButton
              style={DocterDashboardStyles.nobtn}
              onPress={closeCancel}
            >
              <Text style={DocterDashboardStyles.notext}>No</Text>
            </CustomButton>
          </View>
        </View>
      </MainModal>
    </View>
  );
}
