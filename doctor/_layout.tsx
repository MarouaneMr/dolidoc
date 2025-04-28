import { Tabs, useNavigation } from "expo-router";
import React from "react";

import FilledHomeSvg from "@/Svg/FilledHomeSvg";
import HomeSvg from "@/Svg/HomeSvg";
import CalendarSvg from "@/Svg/CalendarSvg";
import FilledCalendarSvg from "@/Svg/FilledCalendarSvg";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Alert, Text } from "react-native";
import FilledAppointSvg from "@/Svg/FilledAppointSvg";
import AppointSvg from "@/Svg/AppointSvg";
import NotificationSvg from "@/Svg/NotificationSvg";
import ProfileSvg from "@/Svg/ProfileSvg";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { BottomNavStyles } from "@/Styles/BottomNavStyles";
import FilledProfileSvg from "@/Svg/FilledProfileSvg";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import { isAuthenticated } from "@/utils/authentication/authentication";

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { role, user, subscription, profile_completed } =
    useSelector(authSelector);
  const navigation = useNavigation<any>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#242424",
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopWidth: 0,
          shadowColor: "rgba(0,0,0,0.05)",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 1,
          marginBottom: responsiveHeight(1),
          // borderWidth: 1,
          // borderColor: "red",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "100%",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                paddingRight: responsiveWidth(4.5),
                paddingLeft: responsiveWidth(4.5),
              }}
            >
              {accessibilityState?.selected ? (
                <FilledHomeSvg stroke={Colors.primary} />
              ) : (
                <HomeSvg stroke="#242424" />
              )}
              <Text
                style={{
                  fontSize: 10,
                  color: accessibilityState?.selected
                    ? Colors.primary
                    : "#242424",
                }}
              >
                {t("home")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="CalendarScreen"
        options={{
          title: t("calendar"),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FilledCalendarSvg stroke={color} />
            ) : (
              <CalendarSvg stroke={color} />
            ),
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TouchableOpacity
              onPress={() => {
                if (!isAuthenticated) {
                  navigation.navigate("auth/signin/index");
                } else if (!subscription) {
                  navigation.navigate("subscription/index");
                  return;
                }
                onPress();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                paddingRight: responsiveWidth(4.5),
                paddingLeft: responsiveWidth(4.5),
              }}
            >
              {accessibilityState?.selected ? (
                <FilledCalendarSvg stroke={Colors.primary} />
              ) : (
                <CalendarSvg stroke="#242424" />
              )}
              <Text
                style={{
                  fontSize: 10,
                  color: accessibilityState?.selected
                    ? Colors.primary
                    : "#242424",
                }}
              >
                {t("calendar")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: t("appointments"),
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TouchableOpacity
              onPress={() => {
                if (!isAuthenticated) {
                  navigation.navigate("auth/signin/index");
                } else if (!subscription) {
                  navigation.navigate("subscription/index");
                  return;
                }
                onPress();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                paddingRight: responsiveWidth(4.5),
                paddingLeft: responsiveWidth(4.5),
              }}
            >
              {accessibilityState?.selected ? (
                <FilledAppointSvg stroke={Colors.primary} />
              ) : (
                <AppointSvg stroke="#242424" />
              )}
              <Text
                style={{
                  fontSize: 10,
                  color: accessibilityState?.selected
                    ? Colors.primary
                    : "#242424",
                }}
              >
                {t("appointments")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: t("notifications"),
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TouchableOpacity
              onPress={() => {
                if (!isAuthenticated) {
                  navigation.navigate("auth/signin/index");
                } else if (!subscription) {
                  navigation.navigate("subscription/index");
                  return;
                }
                onPress();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                paddingRight: responsiveWidth(4.5),
                paddingLeft: responsiveWidth(4.5),
              }}
            >
              {accessibilityState?.selected ? (
                <NotificationSvg stroke={Colors.primary} />
              ) : (
                <NotificationSvg stroke="#242424" />
              )}
              <Text
                style={{
                  fontSize: 10,
                  color: accessibilityState?.selected
                    ? Colors.primary
                    : "#242424",
                }}
              >
                {t("notifications")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarButton: ({ onPress, accessibilityState }) => (
            <TouchableOpacity
              onPress={() => {
                if (!isAuthenticated) {
                  navigation.navigate("auth/signin/index");
                } else if (
                  role === "doctor" &&
                  !user?.profile_completed &&
                  !profile_completed
                ) {
                  onPress();

                } else if (!subscription) {
                  navigation.navigate("subscription/index");
                  return;
                }
                onPress();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                paddingRight: responsiveWidth(4.5),
                paddingLeft: responsiveWidth(4.5),
              }}
            >
              {accessibilityState?.selected ? (
                <FilledProfileSvg stroke={Colors.primary} />
              ) : (
                <ProfileSvg stroke="#242424" />
              )}
              <Text
                style={{
                  fontSize: 10,
                  color: accessibilityState?.selected
                    ? Colors.primary
                    : "#242424",
                }}
              >
                {t("profile")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
