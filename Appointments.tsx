import {
  ActivityIndicator,
  ActivityIndicatorBase,
  Button,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import PatientAppointConatiner from "@/components/PatientAppointConatiner";
import { PatientAppointConatinerStyles } from "@/Styles/PatientAppointConatinerStyles";
import { ThemedText } from "@/components/ThemedText";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import { MyAppointmentsStyles } from "@/Styles/MyAppointmentsStyles";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { PatientData } from "@/Data/PatientData";
import AppointmentsHook from "@/hooks/AppointmentsHook";
import { useCheckUser } from "@/hooks/checkUser";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import ProfileHook from "@/hooks/ProfileHook";
import DoctorSvg from "@/Svg/DoctorSvg";
import PatientSvg from "@/Svg/PatientSvg";
import useGetAppointments from "@/hooks/useGetAppointments";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import DocterDashboardHook from "@/hooks/DocterDashboardHook";
import { getAuth } from "firebase/auth";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import SelectRole from "../auth/role/SelectRole";
import { isAuthenticated } from "@/utils/authentication/authentication";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import MainModal from "@/Modal/MainModal";

export default function Appointments() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { Data } = PatientData();
  const [Item,setItem] = useState<any>();
  const { handleBackPress, filteredData, setActiveTab, activeTab } =
    AppointmentsHook();
  const { handelContinue, activeRole, setactiveRole } = ProfileHook();
  const { appointmentStatuses, loading, setAppointmentStatus,updateAppointmentStatus } =
    useGetAppointments();
  const { opencancelModal, open,cancelmodal,closeCancel,id,isLoading } = DocterDashboardHook();
  const { toast } = useToast();
  const { user } = useSelector(authSelector);

  return (
    <>
      {!user || !isAuthenticated() ? (
        <>
          <SelectRole />
        </>
      ) : (
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={LanguageScreenSttyles.Maincontainer}>
              <TopContainer
                title={t("my_appointment")}
                onPress={handleBackPress}
              />
              <View style={LanguageScreenSttyles.container}>
                {/* <SearchInputComp
                placeholder="Search"
                style={LanguageScreenSttyles.input}
              />
              */}
                <View style={MyAppointmentsStyles.conatiner}>
                  <CustomButton
                    onPress={() => {
                      setActiveTab("Upcoming");
                      setAppointmentStatus("pending");
                    }}
                    style={[
                      MainScreenStyles.cont2,
                      activeTab === "Upcoming" && MainScreenStyles.active,
                    ]}
                  >
                    <ThemedText
                      type={
                        activeTab === "Upcoming" ? "bluetext" : "primaryText"
                      }
                    >
                      {t("upcoming")}
                    </ThemedText>
                  </CustomButton>
                  <CustomButton
                    onPress={() => {
                      setActiveTab("Completed");
                      setAppointmentStatus("completed");
                    }}
                    style={[
                      MainScreenStyles.cont2,
                      activeTab === "Completed" && MainScreenStyles.active,
                    ]}
                  >
                    <ThemedText
                      type={
                        activeTab === "Completed" ? "bluetext" : "primaryText"
                      }
                    >
                      {t("Completed")}
                    </ThemedText>
                  </CustomButton>
                  <CustomButton
                    onPress={() => {
                      setActiveTab("Cancelled");
                      setAppointmentStatus("cancelled");
                    }}
                    style={[
                      MainScreenStyles.cont2,
                      activeTab === "Cancelled" && MainScreenStyles.active,
                    ]}
                  >
                    <ThemedText
                      type={
                        activeTab === "Cancelled" ? "bluetext" : "primaryText"
                      }
                    >
                      {t("cancelled")}
                    </ThemedText>
                  </CustomButton>
                </View>
                <Progress loading={loading || isLoading} />
                <FlatList
                  data={appointmentStatuses}
                  style={PatientAppointConatinerStyles.margin}
                  renderItem={({ item, index }) => (
                    <PatientAppointConatiner
                      image={{ uri: item.image }}
                      status={item.status}
                      name={item.name}
                      time={item.time}
                      Date={item.date}
                      appointment={item}
                      Age={"20"}
                      Gender={item.gender}
                      location={item.location}
                      ProfilePress={() => {
                        navigation.navigate("patientProfileView/index", {
                          item,
                        });
                      }}
                      id={item.id}
                      // reschedulePress={open}
                      CancelClick={() =>{
                         opencancelModal(item.id)
                        setItem(item);
                        }}
                    />
                  )}
                  keyExtractor={(index) => index.toString()}
                  numColumns={1}
                  scrollEnabled={false}
                />
              </View>

            </View>
          </ScrollView>
           <MainModal open={cancelmodal} close={closeCancel}>
                  <View style={DocterDashboardStyles.modal}>
                    <ThemedText type="SecLightHeading">
                      Are You Sure Want You To Cancel This Appointment?
                    </ThemedText>
                    <View style={DocterDashboardStyles.btnConatiner}>
                      <CustomButton
                        style={DocterDashboardStyles.yesbtn}
                        onPress={() => {
                          updateAppointmentStatus(id, "cancelled", Item);
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
      )}
    </>
  );
}
