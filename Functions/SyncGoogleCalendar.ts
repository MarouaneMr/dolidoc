import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import useGetAppointments from "@/hooks/useGetAppointments";

const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const iOSClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
GoogleSignin.configure({
  webClientId: webClientId,
  iosClientId: iOSClientId,
  profileImageSize: 400,
  offlineAccess: false,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const onSyncCalendar = async () => {
  const { appointment } = useGetAppointments(); // Assuming appointment has date and start time
  try {
    // Sign in with Google
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    const accessToken = tokens.accessToken;
    console.log("access token: ",accessToken)

    // Sync appointments to Google Calendar
    for (let event of appointment) {
      await addEventToGoogleCalendar(accessToken, event);
    }

    console.log("Appointments synced to Google Calendar!");
  } catch (error: any) {
    console.error("Error syncing with Google Calendar:", error);
  }
};
async function addEventToGoogleCalendar(accessToken: string, event: any) {
  try {
    const eventDate = event.date;
    const eventTime = event.time;
    console.log("type: ", typeof eventTime, eventTime);

    if (!eventDate || !eventTime) {
      throw new Error("Invalid date or time provided");
    }

    let start = new Date(`${eventDate}`);

    const [time, modifier] = eventTime.split(" ");
    const [hours, minutes] = time.split(":");

    start.setHours(
      modifier === "PM" ? parseInt(hours) + 12 : parseInt(hours),
      parseInt(minutes),
      0,
      0
    );
    //   start.setTime(eventTime)
    // console.log("start: ", start);
    if (isNaN(start.getTime())) {
      throw new Error("Invalid start date or time format");
    }

    const end = new Date(start.getTime() + 60 * 60 * 1000); // Adds 1 hour
    console.log("Start and End times:", start, end);

    const calendarEvent = {
      summary: `Appointment`,
      description: event.description || "No description",
      start: {
        dateTime: start.toISOString(),
        timeZone: getTimeZone(), // Adjust timezone if needed
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: getTimeZone(),
      },
    };

    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      calendarEvent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Event created in Google Calendar:", response.data);
  } catch (error: any) {
    console.error(
      "Error creating event:",
      error.response?.data || error.message
    );
  }
}

export default onSyncCalendar;
