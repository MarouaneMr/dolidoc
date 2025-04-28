import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import CustomButton from "@/components/CustomButton";
import { useNavigation } from "expo-router";
import RadioButtonComp from "@/components/RadioButtonComp";
import { SubscriptionStyles } from "@/Styles/SubscriptionStyles";
import {
  StripeProvider,
  CardField,
  PlatformPay,
  useStripe,
  usePlatformPay,
} from "@stripe/stripe-react-native";
import { confirmPlatformPayPayment } from "@stripe/stripe-react-native";

import { useTranslation } from "react-i18next";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";
import axios from "axios";
import { isAuthenticated } from "@/utils/authentication/authentication";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useDispatch } from "react-redux";
import { setSubscription } from "@/Redux/Slices/auth";
import Progress from "@/utils/Functions/Progress Indicator/Progress";

const secKey = process.env.EXPO_PUBLIC_SK;
const publicKey = process.env.EXPO_PUBLIC_PK;

export default function PaymentMethods() {
  const navigation = useNavigation<any>();
  const [selectedValue, setSelectedValue] = useState("");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentInstantiated, setPaymentInstantiated] = useState(false);

  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getPaymentIntent = async () => {
    try {
      const response = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            amount: "5200",
            currency: "usd",
          }).toString(),
        }
      );

      const paymentIntent = await response.json();
      return paymentIntent.client_secret;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const subscribe = async () => {
    const userId = isAuthenticated()?.uid;
    if (!userId) {
      return;
    }
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + 30);
    await setDoc(doc(db, "user_subscriptions", userId), {
      planId: "monthly_500_mad",
      startDate: serverTimestamp(),
      expiryDate: expiryDate.getTime(),
      status: "active",
    });
    const subscriptionDoc = await getDoc(doc(db, "user_subscriptions", userId));
    if (subscriptionDoc.exists()) {
      const subscriptionData = subscriptionDoc.data();
      dispatch(
        setSubscription({
          ...subscriptionData,
          startDate: subscriptionData.startDate
            ? subscriptionData.startDate.toMillis()
            : null,
        })
      );
    }
    showToast("Subscription purchased!", "success", "Subscribed");
  };

  const makePayment = async () => {
    setPaymentInstantiated(true);
    setLoading(true);
    switch (selectedValue) {
      case "CreditCard": {
        try {
          const client_secret = await getPaymentIntent();
          if (!client_secret) {
            showToast("Error creating payment intent", "error", "Error");
            setLoading(false);
            return;
          }
          setLoading(false);
          const initResponse = await initPaymentSheet({
            merchantDisplayName: "Hello",
            paymentIntentClientSecret: client_secret,
          });

          if (initResponse.error) {
            showToast("Error initializing payment sheet", "error", "Error");
            return;
          }

          const paymentResponse = await presentPaymentSheet();
          if (paymentResponse.error) {
            showToast(paymentResponse.error.message, "error", "Error");
          } else {
            subscribe();
            navigation.navigate("subscription/PaymentSuccessScreen");
          }
        } catch (error: any) {
          showToast(
            error?.message || "something went wrong! Please try again later",
            "error",
            "Error"
          );
        } finally {
          setPaymentInstantiated(false);
        }
        break;
      }
    }
  };

  return (
    <StripeProvider publishableKey={publicKey}>
      <View style={{ flex: 1 }}>
        <Progress loading={loading} />

        {toast && (
          <DynamicToast
            text={toast.text}
            heading={toast.heading}
            // bgColor={toast.type === "success" ? "white" : "red"}
          />
        )}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={RegAsStyles.Maincontainer}>
            <TopContainer title={t("Payment Methods")} onPress={backPress} />
            <View style={SubscriptionStyles.container}>
              <RadioButtonComp
                value="CreditCard"
                label={t("credit_card")}
                selectedValue={selectedValue}
                onValueChange={(value) => setSelectedValue(value)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={RegAsStyles.bottomContainer}>
          {!paymentInstantiated && (
            <>
              <CustomButton
                style={RegAsStyles.continuebtn}
                onPress={() => {
                  if (selectedValue) {
                    makePayment();
                  } else {
                    return;
                  }
                }}
              >
                <Text style={RegAsStyles.text}>{t("continue")}</Text>
              </CustomButton>
              <CustomButton
                style={RegAsStyles.continuebtn}
                onPress={() => navigation.navigate("doctor")}
              >
                <Text style={RegAsStyles.text}>{t("home")}</Text>
              </CustomButton>
            </>
          )}
        </View>
      </View>
    </StripeProvider>
  );
}
