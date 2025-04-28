import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation, useRoute } from "@react-navigation/native";
import DynamicToast from "@/components/DynamicToast";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import AboutMeCardStyles from "@/Styles/AboutMeCardStyles";
import ClinicHomeStyles from "@/Styles/ClinicHomeStyles";
import TelePhoneSvg from "@/Svg/TelephoneSvg";
import MessageSvg from "@/Svg/MessageSvg";
import { DoctorInfoContinerstyles } from "@/Styles/DoctorInfoContinerStyles";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import ContractDetails from "@/components/ContractDetails";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import useAdmin from "@/hooks/useAdmin";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/Context/ToastProvider";

export default function ClinicDetails() {
  const route = useRoute();
  const item = route.params;
  console.log("iteneemm: ",item)
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { loading, doctors } = useAdmin();
  const { toast } = useToast();
  return (
    <>
      <View style={{ flex: 1 }}>
        {toast && (
          <DynamicToast
            text={toast.text}
            heading={toast.heading}
            bgColor={toast.type === "success" ? "white" : "red"}
          />
        )}
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={LanguageScreenSttyles.Maincontainer}>
              <TopContainer
                title={item?.item?.name}
                onPress={backPress}
              />
              <View style={AboutMeCardStyles.main}>
                <Image
                  source={{ uri: item?.item?.imageSource }}
                  style={AboutMeCardStyles.docImg2}
                />
                <View>
                  <ThemedText type="primaryHeading">
                    {item?.item?.name}
                  </ThemedText>
                  <View
                    style={[AboutMeCardStyles.status, AboutMeCardStyles.margin]}
                  >
                    <ThemedText type="secText">
                      {item?.item?.clinic_disc}
                    </ThemedText>
                    <ThemedText type="secText"> |</ThemedText>
                    <ThemedText type="secText">
                      {item?.item?.days
                        ?.split("-")
                        .map((day: string) => day.slice(0, 3))
                        .join("-")}
                      ({item?.item?.startTime}-{item?.item?.endTime})
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="secText"
                    style={DoctorInfoContinerstyles.margin}
                  >
                    {item?.item?.placeName}
                  </ThemedText>
                  <View style={ClinicHomeStyles.continer}>
                    <View style={DoctorInfoContinerstyles.status}>
                      <TelePhoneSvg />
                      <ThemedText
                        type="secText"
                        style={ClinicHomeStyles.statustext}
                      >
                        {item?.item?.phone_number}
                      </ThemedText>
                    </View>
                    <View style={DoctorInfoContinerstyles.status}>
                      <MessageSvg />
                      <ThemedText
                        type="secText"
                        style={ClinicHomeStyles.statustext}
                      >
                        {item?.item?.email}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
              <ThemedText style={MainScreenStyles.proText}>
                Date of Creation
              </ThemedText>
              <ThemedText style={MainScreenStyles.proText2}>
                {item?.item?.createdAt}
              </ThemedText>

              <View style={DoctorInfoContinerstyles.available}>
                {/* <View style={DoctorInfoContinerstyles.dropdown2}>
                <RNPickerSelect
                  onValueChange={(value) =>
                    handleChangeStatus(value, item?.item?.id)
                  }
                  items={[
                    { label: t("av"), value: "Available" },
                    { label: t("unav"), value: "Unavailable" },
                  ]}
                  placeholder={{
                    label: item?.item?.status,
                    value: item?.item?.status,
                  }}
                  style={{
                    inputIOS: DoctorInfoContinerstyles.inputIOS2,
                    inputAndroid: DoctorInfoContinerstyles.inputAndroid2,
                    iconContainer: DoctorInfoContinerstyles.iconContainer2,
                  }}
                  value={selectedStatus}
                />
              </View> */}
                {/* <View style={styles.container}>
                <RNPickerSelect
                  onValueChange={(value) => setStatus(value)}
                  items={[
                    { label: "Available", value: "available" },
                    { label: "Unavailable", value: "unavailable" },
                  ]}
                  placeholder={{ label: "Select Status", value: null }}
                  style={{
                    inputIOS: styles.dropdown,
                    inputAndroid: styles.dropdown,
                    iconContainer: styles.iconContainer,
                  }}
                  value={status}
                  Icon={() => (
                    <Ionicons
                      name="chevron-down"
                      size={responsiveWidth(5)}
                      color="#000000"
                    />
                  )}
                />
              </View> */}
              </View>
              {/* <View style={MainScreenStyles.cont}>
              <CustomButton
                onPress={() => setActiveView("profile")}
                style={[
                  IndexStyles.tabButton,
                  activeView === "profile" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={activeView === "profile" ? "bluetext" : "primaryText"}
                >
                  {t("clin_prof")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => {
                  setActiveView("contract");
                  //   fetchReviews(item.item.uid);
                }}
                style={[
                  IndexStyles.tabButton,
                  activeView === "contract" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={
                    activeView === "revicontractew"
                      ? "bluetext"
                      : "primaryText"
                  }
                >
                  {t("contract")}
                </ThemedText>
              </CustomButton>
            </View> */}
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#107ACA"
                  style={{ height: responsiveHeight(20) }}
                />
              )}
              {/* {activeView === "profile" ? (
              <View>
                <ThemedText style={MainScreenStyles.proText}>
                  Date of Creation
                </ThemedText>
                <ThemedText style={MainScreenStyles.proText2}>
                  {item?.item?.createdAt}
                </ThemedText>
                <ThemedText style={MainScreenStyles.proText}>
                  Registered Doctors
                </ThemedText>
                <ThemedText style={MainScreenStyles.proText2}>
                  {doctors.length} {t("doctors")}
                </ThemedText>
                <ThemedText style={MainScreenStyles.proText}>
                  Availability
                </ThemedText>
                <View style={MainScreenStyles.avCont}>
                  <View>
                    <ThemedText style={MainScreenStyles.proText}>
                      Days
                    </ThemedText>
                    <ThemedText style={MainScreenStyles.proText2}>
                      {item?.item?.days}
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText style={MainScreenStyles.proText}>
                      Timings
                    </ThemedText>
                    <ThemedText style={MainScreenStyles.proText2}>
                      {item?.item?.startTime}-{item?.item?.endTime}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ) : ( */}
              <View>
                <ContractDetails />
              </View>
              {/* )} */}
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(4),
  },
  dropdown: {
    backgroundColor: "#107ACA1A", // Background color for dropdown
    borderRadius: responsiveWidth(6),
    color: "#107ACA", // Text color
    // padding: responsiveWidth(3),
    fontSize: responsiveWidth(4),
    paddingLeft: responsiveWidth(13),
    paddingRight: responsiveWidth(15),
    paddingTop: responsiveWidth(2),
    paddingBottom: responsiveWidth(2),
  },
  iconContainer: {
    right: responsiveWidth(2), // Adjust icon position
    top: responsiveWidth(2), // Center it vertically
    marginRight: responsiveWidth(1),
  },
});
