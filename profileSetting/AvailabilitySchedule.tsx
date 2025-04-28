import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopContainer from "@/components/TopContainer";
import InputComp from "@/components/InputComp";
import CustomButton from "@/components/CustomButton";
import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { signInStyles } from "@/Styles/signInStyles";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { AvailabilityScheduleStyles } from "@/Styles/AvailabilityScheduleStyles";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import { ThemedText } from "@/components/ThemedText";
import PlusSvg from "@/Svg/PlusSvg";
import DeleteSvg from "@/Svg/DeleteSvg";
import { FlatList } from "react-native-gesture-handler";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import moment from "moment";
import MainModal from "@/Modal/MainModal";
import { Calendar } from "react-native-calendars";
import Modalstyles from "@/Styles/Modal";
import { useTranslation } from "react-i18next";
import useDoctorAvailabilitySchedule from "@/hooks/useDoctorAvailabilitySchedule";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import DynamicToast from "@/components/DynamicToast";
import useToast from "@/hooks/useToast";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/FirebaseConfig";

export default function AvailabilitySchedule() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {user} = useSelector(authSelector);
  const {
    days,
    isChecked,
    handleCheckBoxChange,
    showTimePicker,
    addBreakTime,
    removeBreakTime,
    formatTime,
    handleTimeChange,
    showPicker,
    workingHours,
    modalVisible,
    Dates,
    isTimePickerVisible,
    onDateSelected,
    removeDate,
    showCustomTimePicker,
    onTimeChange,
    openModal,
    closeModal,
    times,
    selectedTimeIndex,
    setSelectedTimeIndex,
    handleSetSlot,
    setSlotTime,
    saveAvailabilityData,
    loading,
    setPeople,
    people,
    addCustomDateBreakTime,
    removeCustomDateBreakTime,
    showWoringHoursPicker,
    slotTime,
    errors,
    setErrors,
    docClinc
  } = useDoctorAvailabilitySchedule();
  const { toast } = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Progress loading={loading} />
      {toast && (
        <DynamicToast
          text={toast.text}
          heading={toast.heading}
          // bgColor={toast.type === "success" ? "white" : "red"}
        />
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer
            title="Availability Schedule"
            onPress={() => navigation.goBack()}
          />
          <View style={LanguageScreenSttyles.container}>
            <ThemedLabelText type="default">{t("Setup")}</ThemedLabelText>
            <View>
              <FlatList
                style={AvailabilityScheduleStyles.timeContainer}
                data={times}
                renderItem={({ item, index }) => (
                  <CustomButton
                    style={[
                      AvailabilityScheduleStyles.Timebtn,
                      item.value === slotTime && {
                        backgroundColor: "#247CFF",
                      },
                    ]}
                    onPress={() => {
                      setSelectedTimeIndex(index);
                      handleSetSlot(index);
                    }}
                  >
                    <Text
                      style={[
                        AvailabilityScheduleStyles.Time,
                        selectedTimeIndex === index && { color: "white" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </CustomButton>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                numColumns={2}
                scrollEnabled={false}
              />
              {errors?.slotTime && (
  <Text style={{ color: "red",  fontSize: responsiveFontSize(2), marginTop: responsiveHeight(2) }}>{errors.slotTime}</Text>
)}
            </View>

            <ThemedLabelText type="default">{t("Custom Time")}</ThemedLabelText>
            <InputComp
              style={AvailabilityScheduleStyles.inputmin}
              placeholder={t("Enter Minutes")}
              placeHolderColor="#393939"
              keyboardType="numeric"
              value={slotTime}
              onChangeText={(text: any) =>{ 
                setSlotTime(text);
                setErrors([]);
              }}
            />
         { !docClinc &&
          ( 
            <>
             <ThemedLabelText type="default">
              {t("Customize Specific Days")}
            </ThemedLabelText>
            <View style={AvailabilityScheduleStyles.dec}>
              <ThemedText>
                {t(
                  "Add days when your availability changes from weekly hours."
                )}
              </ThemedText>
            </View>
            <CustomButton
              style={AvailabilityScheduleStyles.addDate}
              onPress={openModal}
            >
              <PlusSvg />
              <Text> Add Date</Text>
            </CustomButton>

            {Dates.map((dateItem, index) => (
              <View>
                <View
                  key={index}
                  style={AvailabilityScheduleStyles.DateInputContainer}
                >
                  <ThemedText
                    type="primaryHeading"
                    style={{
                      fontSize: responsiveFontSize(1.5),
                    }}
                  >
                    {moment(dateItem.date).format("DD MMM, YYYY")}
                  </ThemedText>
                  <Pressable
                    style={AvailabilityScheduleStyles.pressableButton}
                    onPress={() => showCustomTimePicker(index, true)}
                  >
                    <Text>
                      {dateItem.startTime ? dateItem.startTime : "start"}
                    </Text>
                  </Pressable>

                  <Text style={AvailabilityScheduleStyles.timeSeparator}>
                    -
                  </Text>

                  <Pressable
                    style={AvailabilityScheduleStyles.pressableButton}
                    onPress={() => showCustomTimePicker(index, false)}
                  >
                    <Text>{dateItem.endTime ? dateItem.endTime : "end"}</Text>
                  </Pressable>

                  <Pressable
                    style={AvailabilityScheduleStyles.Button}
                    onPress={() => removeDate(index)}
                  >
                    <DeleteSvg />
                  </Pressable>
                  {/* Break Times Section */}
                </View>

                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={AvailabilityScheduleStyles.breakTimeLabel2}>
                    {t("Break Time")}
                  </Text>
                  <View style={{ display: "flex", flexDirection: "column" }}>
                    {dateItem.breakTimes.map((breakTime, breakIndex) => (
                      <View
                        key={breakIndex}
                        // style={AvailabilityScheduleStyles.breakTimeContainer}
                        style={{ marginTop: responsiveHeight(1) }}
                      >
                        <View
                          style={AvailabilityScheduleStyles.timeInputContainer}
                        >
                          <Pressable
                            onPress={() =>
                              showCustomTimePicker(
                                index,
                                true,
                                true,
                                breakIndex
                              )
                            }
                            style={AvailabilityScheduleStyles.pressableButton}
                          >
                            <Text>{breakTime.start || "start"}</Text>
                          </Pressable>
                          <Text
                            style={AvailabilityScheduleStyles.timeSeparator}
                          >
                            -
                          </Text>
                          <Pressable
                            onPress={() =>
                              showCustomTimePicker(
                                index,
                                false,
                                true,
                                breakIndex
                              )
                            }
                            style={AvailabilityScheduleStyles.pressableButton}
                          >
                            <Text>{breakTime.end || "end"}</Text>
                          </Pressable>
                          {breakIndex === 0 ? (
                            <Pressable
                              onPress={() => addCustomDateBreakTime(index)}
                              style={AvailabilityScheduleStyles.Button}
                            >
                              <PlusSvg />
                            </Pressable>
                          ) : (
                            <Pressable
                              onPress={() =>
                                removeCustomDateBreakTime(index, breakIndex)
                              }
                              style={AvailabilityScheduleStyles.Button}
                            >
                              <DeleteSvg />
                            </Pressable>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
            {isTimePickerVisible && (
              <DateTimePicker
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                value={new Date()}
                onChange={onTimeChange}
              />
            )}
            </>
            )}
            <View style={AvailabilityScheduleStyles.regConatiner}>
              <View style={AvailabilityScheduleStyles.text}>
                <ThemedLabelText type="default">
                  {t("How Many people can register the same slot appointment?")}
                </ThemedLabelText>
              </View>
              <InputComp
                style={AvailabilityScheduleStyles.reginput}
                placeholder="1"
                placeHolderColor="#393939"
                keyboardType="numeric"
                value={people}
                onChangeText={(text: any) => setPeople(text)}
              />
            </View>
            <View style={AvailabilityScheduleStyles.workingConatiner}>
              <ThemedLabelText type="default">
                {t("Select Your Working days")}
              </ThemedLabelText>
              {workingHours.filter((day: any) =>
    Array.isArray(docClinc?.availability)
      ? docClinc.availability.includes(day.day)
      : true // If no availability is set, show all
  )
  .map((day: any) => (
                <View
                  key={day.day}
                  style={AvailabilityScheduleStyles.dayConatiner}
                >
                  <View style={AvailabilityScheduleStyles.checkBox}>
                    <Checkbox
                      style={signInStyles.checkbox_Box}
                      value={day.meta.checked}
                      onValueChange={(value) => {
                        handleCheckBoxChange(value, day);
                      }}
                      color={day.meta.checked ? "#107ACA" : undefined}
                    />
                    <ThemedText>{day.day}</ThemedText>
                  </View>

                  {!day.meta.checked && (
                    <ThemedText
                      type="primaryHeading"
                      style={{
                        fontSize: responsiveFontSize(2),
                        marginHorizontal: responsiveWidth(4),
                      }}
                    >
                      {t("Unavailable")}
                    </ThemedText>
                  )}

                  {day.meta.checked && (
                    <View>
                      <View
                        style={AvailabilityScheduleStyles.timeInputContainer}
                      >
                        <Pressable
                          onPress={() => showTimePicker(day, "start", "work")}
                          style={AvailabilityScheduleStyles.pressableButton}
                        >
                          <Text>{day?.meta?.start || "start"}</Text>
                        </Pressable>
                        <Text style={AvailabilityScheduleStyles.timeSeparator}>
                          -
                        </Text>
                        <Pressable
                          onPress={() => showTimePicker(day, "end", "work")}
                          style={AvailabilityScheduleStyles.pressableButton}
                        >
                          <Text>{day?.meta?.end || "end"}</Text>
                        </Pressable>
                      </View>

                      {errors?.[day.day] && (
          <Text style={{ color: "red", fontSize: responsiveFontSize(1.5), marginTop: responsiveHeight(2) }}>
            {errors?.[day.day]}
          </Text>
        )}
                      <Text style={AvailabilityScheduleStyles.breakTimeLabel}>
                        {t("Break Time")}
                      </Text>
                     
                      {/* {console.log("day.meta.breakTimes ", day.meta.breakTimes)} */}
                      {day.meta.breakTimes?.map(
                        (breakTime: any, breakIndex: number) => (
                          <View
                            key={breakIndex}
                            style={
                              AvailabilityScheduleStyles.breakTimeContainer
                            }
                          >
                            <View
                              style={
                                AvailabilityScheduleStyles.timeInputContainer
                              }
                            >
                              <Pressable
                                onPress={() => {
                                  showTimePicker(
                                    day,
                                    "start",
                                    "break",
                                    breakIndex
                                  );
                                }}
                                style={
                                  AvailabilityScheduleStyles.pressableButton
                                }
                              >
                                <Text>{breakTime?.start || "start"}</Text>
                              </Pressable>
                              <Text
                                style={AvailabilityScheduleStyles.timeSeparator}
                              >
                                -
                              </Text>
                              <Pressable
                                onPress={() => {
                                  showTimePicker(
                                    day,
                                    "end",
                                    "break",
                                    breakIndex
                                  );
                                }}
                                style={
                                  AvailabilityScheduleStyles.pressableButton
                                }
                              >
                                <Text>{breakTime?.end || "end"}</Text>
                              </Pressable>
                              {breakIndex === 0 && (
                                <Pressable
                                  onPress={() => addBreakTime(day)}
                                  style={AvailabilityScheduleStyles.Button}
                                >
                                  <PlusSvg />
                                </Pressable>
                              )}
                              {breakIndex > 0 && (
                                <Pressable
                                  onPress={() => {
                                    removeBreakTime(day, breakIndex);
                                  }}
                                  style={AvailabilityScheduleStyles.Button}
                                >
                                  <DeleteSvg />
                                </Pressable>
                              )}
                            </View>
                          </View>
                        )
                      )}
                      
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        <CustomButton
          style={RegisterScreenStyles.nextbtn}
          onPress={saveAvailabilityData}
        >
          <Text style={RegAsStyles.text}>{t("Save")}</Text>
        </CustomButton>
      </ScrollView>
      {showWoringHoursPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
          is24Hour={false}
        />
      )}
      <MainModal open={modalVisible} close={closeModal}>
        <View style={Modalstyles.modal}>
          <Calendar
            onDayPress={onDateSelected}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#247CFF",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#00adf5",
              selectedDotColor: "#ffffff",
              arrowColor: "#247CFF",
              disabledArrowColor: "#d9e1e8",
              monthTextColor: "#247CF",
              indicatorColor: "#247CF",
            }}
          />
        </View>
      </MainModal>
    </View>
  );
}
