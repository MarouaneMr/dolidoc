import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import SubscriptionCarousel from "./SubscriptionCarousel"; // Adjust the import path as necessary
import TopContainer from "@/components/TopContainer";
import { SubscriptionStyles } from "@/Styles/SubscriptionStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import handleSubscribePress from "@/hooks/handleSubscribePress";
import { useSSR, useTranslation } from "react-i18next";
import { db } from "@/FirebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { isAuthenticated } from "@/utils/authentication/authentication";
import useToast from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { setSubscription } from "@/Redux/Slices/auth";
import Progress from "@/utils/Functions/Progress Indicator/Progress";

export default function Subscribe() {
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  async function clearSubscriptions() {
    try {
      const subscriptionsRef = collection(db, "subscriptions");
      const querySnapshot = await getDocs(subscriptionsRef);
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "subscriptions", docSnap.id))
      );
      await Promise.all(deletePromises);
      console.log("All subscriptions deleted successfully.");
    } catch (error) {
      console.error("Error deleting subscriptions:", error);
    }
  }
  const createSubscriptionPlan = async () => {
    await setDoc(doc(db, "subscriptions", "monthly_500_mad"), {
      price: 500,
      duration: 30,
      title: "Monthly",
      currency: "MAD",
      features: [
        "Appointment Management",
        "Calendar Integration",
        "Notification",
        "Search and Filter",
        "Feedback and rating",
      ],
    });
  };

  useEffect(() => {
    // clearSubscriptions();
    // createSubscriptionPlan();
  }, []);

  const unsubscribe = async () => {
    setLoading(true);
    const userId = isAuthenticated()?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      await updateDoc(doc(db, "user_subscriptions", userId), {
        status: "canceled",
        canceledAt: serverTimestamp(),
      });
      setLoading(false);
      showToast("Subscription canceled!", "success", "Unsubscribed");
      dispatch(setSubscription(null));
    } catch (error) {
      setLoading(false);
      console.error("Error canceling subscription:", error);
      showToast("Failed to cancel subscription", "error", "Error");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Progress loading={loading} />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={RegAsStyles.Maincontainer}>
            <TopContainer title={t("Subscription")} onPress={backPress} />
            <View style={SubscriptionStyles.container}>
              <SubscriptionCarousel
                onPress={(isSubscribed) => {
                  if (!isSubscribed) {
                    navigation.navigate("subscription/PaymentMethods");
                  } else {
                    Alert.alert(
                      "Unsubscribe?", // Title
                      "Are you sure you want to unsubscribe?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => unsubscribe(),
                        },
                      ]
                    );
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
