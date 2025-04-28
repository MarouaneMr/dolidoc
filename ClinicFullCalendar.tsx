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
import renderItem from "@/components/CalenderRenderItem";
import useClinicFullCalendar from "@/hooks/useClinicFullCalendar";

export default function ClinicFullCalendar({ appointments }: any) {
  const {
    groupAppointmentsByDate,
    generateMarkedDates
  } = useClinicFullCalendar(appointments);
  const groupedAppointments = groupAppointmentsByDate(appointments)
  const today = new Date();
  const markedDates = generateMarkedDates(groupedAppointments);

  return (
    <View style={FullCalendarStyles.container}>
      <SafeAreaView style={FullCalendarStyles.container}>
        <Agenda
          items={groupedAppointments}
          renderItem={
            renderItem as unknown as (
              reservation: AgendaEntry,
              isFirst: boolean
            ) => React.ReactElement
          }
          selected={today}
          renderEmptyData={() => <Text>No Appointments</Text>}
          markedDates={markedDates}
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
