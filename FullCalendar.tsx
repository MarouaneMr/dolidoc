import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import { Agenda, AgendaEntry, AgendaSchedule } from "react-native-calendars";
import { items, AgendaItem, Items } from "../Data/appointmentItems";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import useGetAppointments from "@/hooks/useGetAppointments";
import { FullCalendarStyles } from "@/Styles/FullCalenderStyles";
import { DoctorInfoContinerstyles } from "@/Styles/DoctorInfoContinerStyles";
import useFullCalendar from "@/hooks/useFullCalendar";
import renderItem from "@/components/CalenderRenderItem";

export default function FullCalendar() {
  const {
    markedDates,
    generateMarkedDates,
    groupedAppointments,
    truncateText,
    groupedDocAppointments,
    markedDocDates,
  } = useFullCalendar();
  const { user } = useGetAppointments();
  let updatedGroupedAppointments;
if(groupedAppointments){
   updatedGroupedAppointments = Object.fromEntries(
    Object.entries(groupedAppointments).map(([date, appointments]) => [
      date,
      appointments.map((appointment:any) => ({
        ...appointment,
        time: appointment.time?.start, // Replace time object with time.start
      })),
    ])
  );
}
  const today = new Date();

  return (
    <View style={FullCalendarStyles.container}>
      <SafeAreaView style={FullCalendarStyles.container}>
        <Agenda
          items={
            user && user.role === "doctor"
              ? (groupedDocAppointments as unknown as AgendaSchedule)
              : (updatedGroupedAppointments as unknown as AgendaSchedule)
          }
          renderItem={
            renderItem as unknown as (
              reservation: AgendaEntry,
              isFirst: boolean
            ) => React.ReactElement
          }
          selected={today}
          renderEmptyData={() => (
            <Text style={{ alignSelf: "center", margin: 1 }}>
              No Appointments
            </Text>
          )}
          markedDates={
            user && user.role === "doctor" ? markedDocDates : markedDates
          }
          theme={{
            selectedDayBackgroundColor: "#107ACA",
            dotColor: "#107ACA",
            todayTextColor: "#107ACA",
            agendaDayTextColor: "#107ACA",
            agendaDayNumColor: "#107ACA",
            agendaTodayColor: "#107ACA",
            agendaKnobColor: "#107ACA",
          }}
        />
      </SafeAreaView>
    </View>
  );
}
