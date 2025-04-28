import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import FilledHomeSvg from "@/Svg/FilledHomeSvg";
import HomeSvg from "@/Svg/HomeSvg";
import CalendarSvg from "@/Svg/CalendarSvg";
import FilledCalendarSvg from "@/Svg/FilledCalendarSvg";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text } from "react-native";
import FilledAppointSvg from "@/Svg/FilledAppointSvg";
import AppointSvg from "@/Svg/AppointSvg";
import NotificationSvg from "@/Svg/NotificationSvg";
import ProfileSvg from "@/Svg/ProfileSvg";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { BottomNavStyles } from "@/Styles/BottomNavStyles";
import FilledProfileSvg from "@/Svg/FilledProfileSvg";
import { useCheckUser } from "@/hooks/checkUser";
import { isAuthenticated } from "@/utils/authentication/authentication";
import FilledNotificationSvg from "@/Svg/FilledNotificationSvg";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { loading, currentUser } = useCheckUser();
  if (loading) {
    // Optional: Show a loading spinner or return null while loading
    return null;
  }

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
          // height: responsiveHeight(6),
          // paddingVertical: responsiveHeight(1),
          alignItems: "center",
          justifyContent: "center",
          marginBottom: responsiveHeight(1),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FilledHomeSvg stroke={color} />
            ) : (
              <HomeSvg stroke={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FilledCalendarSvg stroke={color} />
            ) : (
              <CalendarSvg stroke={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="Appointments"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FilledAppointSvg stroke={color} />
            ) : (
              <AppointSvg stroke={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FilledNotificationSvg stroke={color} />
            ) : (
              <NotificationSvg stroke={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FilledProfileSvg stroke={color} />
            ) : (
              <ProfileSvg stroke={color} />
            ),
        }}
      />
    </Tabs>
  );
}
