import { SubscData } from "@/Data/SubscData";
import { db } from "@/FirebaseConfig";
import { authSelector } from "@/Redux/Slices/auth";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { SubscriptionStyles } from "@/Styles/SubscriptionStyles";
import TickSvg from "@/Svg/TickSvg";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  ScrollView,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useSelector } from "react-redux";

const { width: screenWidth } = Dimensions.get("window");

interface Subscription {
  title: string;
  price: string;
  features: string[];
  id: Number;
}

interface SubscriptionCarouselProps {
  onPress: (isSubscribed: boolean) => void;
}
const SubscriptionCarousel: React.FC<SubscriptionCarouselProps> = ({
  onPress,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const { t } = useTranslation();
  const [subData, setSubData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { subscription } = useSelector(authSelector);
  // console.log("subscription ", subscription);
  async function getAllSubscriptions() {
    try {
      const subscriptionsRef = collection(db, "subscriptions");
      const querySnapshot = await getDocs(subscriptionsRef);

      const subscriptions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return subscriptions;
    } catch (error) {
      return [];
    }
  }

  useEffect(() => {
    setLoading(true);
    getAllSubscriptions().then((subscriptions) => {
      setLoading(false);
      // console.log("Subscriptions => ", subscriptions);
      setSubData(subscriptions);
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Progress loading={loading} />
        {subData && Array.isArray(subData) && subData.length > 0 ? (
          <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={SubscriptionStyles.maincontainer}>
                <Carousel
                  data={subData}
                  renderItem={({ item }: { item: Subscription }) => (
                    <ImageBackground
                      source={require("../../assets/images/subsBg.png")}
                      style={SubscriptionStyles.card}
                      imageStyle={SubscriptionStyles.backgroundImage}
                    >
                      <View style={SubscriptionStyles.titleConatiner}>
                        <Text style={SubscriptionStyles.title}>
                          {item.title}
                        </Text>
                        <Text style={SubscriptionStyles.title}>
                          {item.price}
                        </Text>
                      </View>
                      {item.features.map((feature, index) => (
                        <View
                          key={index}
                          style={SubscriptionStyles.featureContiner}
                        >
                          <TickSvg />
                          <Text style={SubscriptionStyles.feature}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                      <Pressable
                        style={SubscriptionStyles.button}
                        onPress={() =>
                          onPress(
                            subscription
                              ? item.id == subscription?.planId
                              : false
                          )
                        }
                      >
                        <Text style={SubscriptionStyles.buttonText}>
                          {subscription && item.id == subscription.planId
                            ? "Unsubscribe"
                            : t("subscribe_now")}
                        </Text>
                      </Pressable>
                    </ImageBackground>
                  )}
                  sliderWidth={screenWidth}
                  itemWidth={screenWidth}
                  layout={"default"}
                  loop={false}
                  scrollEnabled={true}
                  disableIntervalMomentum={true}
                  onSnapToItem={(index) => setActiveIndex(index)}
                  containerCustomStyle={SubscriptionStyles.carouselContainer}
                />
              </View>
            </ScrollView>
            <View style={RegAsStyles.bottomContainer}>
              <Pagination
                dotsLength={subData.length}
                activeDotIndex={activeIndex}
                containerStyle={SubscriptionStyles.paginationContainer}
                dotStyle={SubscriptionStyles.activeDot}
                inactiveDotStyle={SubscriptionStyles.inactiveDot}
              />
            </View>
          </>
        ) : (
          <>
            {!loading && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    color: "#157ACA",
                  }}
                  onPress={() => {
                    setLoading(true);
                    getAllSubscriptions().then((subscriptions) => {
                      setLoading(false);
                      setSubData(subscriptions);
                    });
                  }}
                >
                  Retry?
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SubscriptionCarousel;
