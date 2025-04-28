import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import store from "../Redux/Store/store";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StripeProvider } from "@stripe/stripe-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import * as Notifications from "expo-notifications";
import { ToastProvider } from "@/Context/ToastProvider";
import CustomSplashScreen from "@/components/CustomSplash";
SplashScreen.preventAutoHideAsync();

const publicKey = process.env.EXPO_PUBLIC_PK;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsSplashVisible(false); // Hide splash after 5 seconds
    }, 5000);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // Optional: Handle notifications when the app is in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  LogBox.ignoreAllLogs();
  if (isSplashVisible) {
    return <CustomSplashScreen />; // Show custom splash while `isSplashVisible` is true
  }

  return (
    <Provider store={store}>
      <ToastProvider>
        <StripeProvider publishableKey={publicKey}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* <ThemeProvider 
    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    > */}

            <Stack>
              <Stack.Screen
                name="(mainscreen)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="clinics" options={{ headerShown: false }} />
              <Stack.Screen
                name="clinics/profile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="clinics/doctors"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="addDoctor/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="addDoctor/DocProfile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ClinicProfile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="clinicDetail/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="clinicDetail/ClinicDetail"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="filtered/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="admin" options={{ headerShown: false }} />

              <Stack.Screen
                name="adminScreens/ClinicDetails"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="adminScreens/DoctorDetails"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="addClinic/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Appointments"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="appointments"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RegisterAs"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PatientProfile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DoctorSpeciality"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DoctorInfoFilter"
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen name="tabs" options={{ headerShown: false }} /> */}
              <Stack.Screen
                name="SingleDocInfoScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patient/appntnt/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patient/myappntnt/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patient/detail/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patient/Calendar"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patient/patientProfile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patient/successfullyregister/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LanguageScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/signin/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/signup/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/signup/RegisterScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/signup/ClinicRegister"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/signup/SuccessScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="subscription/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="subscription/PaymentMethods"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="subscription/PaymentSuccessScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="subscription/ApplePay"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="subscription/BankTransferScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="doctor" options={{ headerShown: false }} />
              <Stack.Screen
                name="doctor/FullCalendar"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfileSetting"
                options={{ headerShown: false }}
                
              />
              <Stack.Screen
                name="AboutTheApp"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="aboutApp/AppVersionInfo"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="aboutApp/TermsofService"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="aboutApp/PrivacyPolicy"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="profileSetting/BasicInfoScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="profileSetting/BasicScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="profileSetting/IntermediateInfoScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="profileSetting/AvailabilitySchedule"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="History" options={{ headerShown: false }} />
              <Stack.Screen
                name="history/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="patientProfileView/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="doctorProfileView/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SearchScreen"
                options={{ headerShown: false }}
              />
            </Stack>
            {/* </ThemeProvider> */}
          </GestureHandlerRootView>
        </StripeProvider>
      </ToastProvider>
    </Provider>
  );
}
