import { ThemedText } from "@/components/ThemedText";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  LogBox,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import LocationPinSvg from "@/Svg/LocationPinSvg";
import { useNavigation } from "expo-router";
import ListSvg from "@/Svg/ListSvg";
import { useEffect, useLayoutEffect, useState } from "react";
import SearchInputComp from "@/components/SearchInputComp";
import LangSvg from "@/Svg/LangSvg";
import CustomButton from "@/components/CustomButton";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { PatientData } from "@/Data/PatientData";
import PatientAppointConatiner from "@/components/PatientAppointConatiner";
import { PatientAppointConatinerStyles } from "@/Styles/PatientAppointConatinerStyles";
import CaldSvg from "@/Svg/CaldSvg";
import MainModal from "@/Modal/MainModal";
import Modalstyles from "@/Styles/Modal";
import DocterDashboardHook from "@/hooks/DocterDashboardHook";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { Calendar } from "react-native-calendars";
import FullCalendar from "../FullCalendar";
import { useTranslation } from "react-i18next";
import useGetAppointments from "@/hooks/useGetAppointments";
import GetDoctorInfo from "@/hooks/GetDoctorInfo";
import { responsiveHeight } from "react-native-responsive-dimensions";
import useRegisterForPushNotifications from "@/hooks/useGetToken";
import registerForPushNotificationsAsync from "@/hooks/useGetToken";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  setAuth,
  setRole,
  setSubscription,
} from "@/Redux/Slices/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import moment from "moment";
import { getAuth } from "firebase/auth";

export default function DocterDashboard() {
  const { user: currentUser } = useSelector(authSelector);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeView, setActiveView] = useState("list");
  const [activeTab, setActiveTab] = useState<string>("Scheduled");
  const { Data } = PatientData();
  const [scheduled, setScheduled] = useState<any>([]);
  const [completed, setCompleted] = useState<any>([]);
  const [pending, setPending] = useState<any>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [rejected, setRejected] = useState<any>([]);
  const {
    open,
    close,
    modal,
    cancelmodal,
    opencancelModal,
    closeCancel,
    id,
    availableSlots,
    handleDateSelect,
    user,
  } = DocterDashboardHook(currentUser.id);

  const {
    appointmentStatuses,
    refreshing,
    onRefresh,
    loading,
    // pending,
    // completed,
    // rejected,
    // scheduled,
    updateAppointmentStatus,
  } = useGetAppointments();
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    getAppointmentCountsBasedOnstatus();
  }, [appointmentStatuses]); //if appointments update in appointments screen
  const { toast } = useToast();
  LogBox.ignoreAllLogs();
  const [Item, setItem] = useState();
  registerForPushNotificationsAsync();

  const getAppointmentCountsBasedOnstatus = async () => {
    try {
      setAppLoading(true);
      const appointmentsCollectionRef = collection(db, "appointments");
      const q =
        user?.role == "doctor"
          ? query(
              appointmentsCollectionRef,
              where("date", "==", moment(new Date()).format("YYYY-MM-DD")),
              where("doctor_id", "==", user.uid)
            )
          : query(
              appointmentsCollectionRef,
              where("date", "==", moment(new Date()).format("YYYY-MM-DD")),
              where("patient_id", "==", user.uid)
            );
      const appointmentsSnapshot = await getDocs(q);
      const scheduled: any[] = [],
        completed: any[] = [],
        pending: any[] = [],
        rejected: any[] = [];
      appointmentsSnapshot.docs.map((doc) => {
        switch (doc.data().status) {
          case "completed":
            completed.push({ ...doc.data(), id: doc.id });
            break;
          case "pending":
            pending.push({ ...doc.data(), id: doc.id });
            break;
          case "accepted":
            scheduled.push({ ...doc.data(), id: doc.id });
            break;
          case "cancelled":
            rejected.push({ ...doc.data(), id: doc.id });
            break;
        }
      });
      setScheduled(scheduled);
      setCompleted(completed);
      setPending(pending);
      setRejected(rejected);
      setAppLoading(false);
    } catch (e) {
      setAppLoading(false);
      return { scheduled: 0, completed: 0, pending: 0, rejected: 0 };
    }
  };

  //get subscription
  const dispatch = useDispatch();
  const auth = getAuth();
  useLayoutEffect(() => {
    getUserFromFirebaseAuth();
  }, [auth]);

  const getUserFromFirebaseAuth = async () => {
    const user = auth.currentUser;
    if (user) {
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        const user_subscription = await checkUserSubscription();

        dispatch(
          setAuth({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              providerData: user.providerData,
              ...profileData,
            },
            profile_completed: profileData.profile_completed,
            subscription: user_subscription
              ? {
                  ...user_subscription,
                  startDate: user_subscription.startDate
                    ? user_subscription.startDate.toMillis()
                    : null,
                }
              : null,
          })
        );
        dispatch(setRole(profileData.role));
      }
    }
  };

  const checkUserSubscription = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const q = query(
      collection(db, "user_subscriptions"),
      where("status", "==", "active"),
      where("__name__", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const subscriptionDoc = querySnapshot.docs[0];
    const subscriptionData = subscriptionDoc.data();

    const expiryDate = subscriptionData.expiryDate;
    const currentDate = Date.now();

    if (expiryDate < currentDate) {
      await updateDoc(subscriptionDoc.ref, { status: "cancel" });
      return null;
    }
    return subscriptionData;
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {toast && (
          <DynamicToast
            text={toast.text}
            heading={toast.heading}
            type={toast.type}
          />
        )}

        <View style={MainScreenStyles.container}>
          <View style={DocterDashboardStyles.conatiner}>
            <View style={DocterDashboardStyles.conatiner2}>
              <Image
                source={
                  user?.image
                    ? { uri: user.image }
                    : require("../../assets/images/doctor.png")
                }
                style={DocterDashboardStyles.img}
              />
              <View>
                <View style={MainScreenStyles.welcomecontainer}>
                  <ThemedText type="ThinTextGray">
                    {" "}
                    {t("welcome")} DoliDoc
                  </ThemedText>
                </View>
                <ThemedText type="primaryHeading"> Dr {user?.name},</ThemedText>
                {/* <CustomButton style={DocterDashboardStyles.locationbtn}>
                  <Entypo name="location-pin" size={18} color="#FFFFFF" />
                  <Text style={DocterDashboardStyles.locationbtntxt}>
                    {t("location")}
                  </Text>
                </CustomButton> */}
              </View>
            </View>
            <View style={MainScreenStyles.welcomebtncont}>
              <CustomButton style={MainScreenStyles.welcomebtn}>
                <LocationPinSvg />
              </CustomButton>
              <CustomButton
                style={MainScreenStyles.welcomebtn}
                onPress={() => navigation.navigate("LanguageScreen")}
              >
                <LangSvg />
              </CustomButton>
            </View>
          </View>

          {/* <View style={MainScreenStyles.serachView}>
            <SearchInputComp
              placeholder={t("search")}
              style={LanguageScreenSttyles.input}
            />
          </View> */}

          <View style={DocterDashboardStyles.filterConatiner}>
            <View style={DocterDashboardStyles.flex}>
              <View style={DocterDashboardStyles.appoinmtContainer}>
                <Text style={DocterDashboardStyles.default}>
                  {t("todays")}{" "}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("schedule")}{" "}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("appointments")}{" "}
                </Text>
                <ThemedText
                  type="SecLightHeading"
                  style={DocterDashboardStyles.margin}
                >
                  {scheduled?.length}
                </ThemedText>
              </View>

              <View style={DocterDashboardStyles.appoinmtContainer}>
                <Text style={DocterDashboardStyles.default}>{t("todays")}</Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("completed")}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("appointments")}{" "}
                </Text>
                <ThemedText
                  type="SecLightHeading"
                  style={DocterDashboardStyles.margin}
                >
                  {completed.length}
                </ThemedText>
              </View>
              <View style={DocterDashboardStyles.appoinmtContainer}>
                <Text style={DocterDashboardStyles.default}>
                  {t("todays")}{" "}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("accepted")}{" "}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("appointments")}{" "}
                </Text>
                <ThemedText
                  type="SecLightHeading"
                  style={DocterDashboardStyles.margin}
                >
                  {scheduled?.length}
                </ThemedText>
              </View>
              <View style={DocterDashboardStyles.appoinmtContainer}>
                <Text style={DocterDashboardStyles.default}>
                  {t("todays")}{" "}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("rejected")}{" "}
                </Text>
                <Text style={DocterDashboardStyles.default}>
                  {t("appointments")}{" "}
                </Text>
                <ThemedText
                  type="SecLightHeading"
                  style={DocterDashboardStyles.margin}
                >
                  {rejected?.length}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={DocterDashboardStyles.container}>
            <CustomButton
              style={[
                DocterDashboardStyles.button,
                activeTab === "Scheduled" && DocterDashboardStyles.activeButton,
              ]}
              onPress={() => setActiveTab("Scheduled")}
            >
              <Text
                style={
                  activeTab === "Scheduled"
                    ? DocterDashboardStyles.activeText
                    : DocterDashboardStyles.text
                }
              >
                {t("todaysScheduleAppointments")}
              </Text>
            </CustomButton>
            <CustomButton
              style={[
                DocterDashboardStyles.button,
                activeTab === "Pending" && DocterDashboardStyles.activeButton,
              ]}
              onPress={() => {
                setActiveTab("Pending");
              }}
            >
              <Text
                style={
                  activeTab === "Pending"
                    ? DocterDashboardStyles.activeText
                    : DocterDashboardStyles.text
                }
              >
                {t("todaysPendingAppointments")}
              </Text>
            </CustomButton>
          </View>

          <View style={MainScreenStyles.cont}>
            <CustomButton
              onPress={() => setActiveView("list")}
              style={[
                MainScreenStyles.cont2,
                activeView === "list" && MainScreenStyles.active,
              ]}
            >
              <ListSvg color={activeView === "list" ? "#107ACA" : "#383838"} />
              <ThemedText
                type={activeView === "list" ? "bluetext" : "primaryText"}
              >
                {t("list")}
              </ThemedText>
            </CustomButton>
            <CustomButton
              onPress={() => setActiveView("calendar")}
              style={[
                MainScreenStyles.cont2,
                activeView === "calendar" && MainScreenStyles.active,
              ]}
            >
              <CaldSvg
                color={activeView === "calendar" ? "#107ACA" : "#383838"}
              />
              <ThemedText
                type={activeView === "calendar" ? "bluetext" : "primaryText"}
              >
                {t("calendar")}
              </ThemedText>
            </CustomButton>
          </View>

          {(loading || appLoading) && (
            <ActivityIndicator
              size="small"
              color="#107ACA"
              style={{ height: responsiveHeight(20) }}
            />
          )}

          {activeView === "list" ? (
            <FlatList
              data={activeTab === "Scheduled" ? scheduled : pending}
              style={PatientAppointConatinerStyles.margin}
              renderItem={({ item, index }) => (
                <PatientAppointConatiner
                  image={{ uri: item.image }}
                  status={item.status}
                  name={item.patientName && item.patientName}
                  time={item.time}
                  Date={item.date}
                  Age={item.Age}
                  Gender={item.patientGender}
                  location={item.location}
                  id={item.id}
                  appointment={item}
                  CancelClick={() => {
                    opencancelModal(item.id);
                    setItem(item);
                  }}
                  ProfilePress={() => {
                    navigation.navigate("doctorProfileView/index", { item });
                  }}
                  updationFunc={getAppointmentCountsBasedOnstatus}
                />
              )}
              // keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              scrollEnabled={false}
              extraData={{ scheduled, pending }}
            />
          ) : (
            <ScrollView>
              <View style={{ height: "auto" }}>
                <FullCalendar />
              </View>
            </ScrollView>
          )}
          <MainModal open={cancelmodal} close={closeCancel}>
            <View style={DocterDashboardStyles.modal}>
              <ThemedText type="SecLightHeading">
                Are You Sure Want You To Cancel This Appointment?
              </ThemedText>
              <View style={DocterDashboardStyles.btnConatiner}>
                <CustomButton
                  style={DocterDashboardStyles.yesbtn}
                  onPress={async () => {
                    if (Item) {
                      await updateAppointmentStatus(
                        String(id),
                        "cancelled",
                        Item
                      );
                      await getAppointmentCountsBasedOnstatus();

                      closeCancel();
                    }
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
      </ScrollView>
    </SafeAreaView>
  );
}
