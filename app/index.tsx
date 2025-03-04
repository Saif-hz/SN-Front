import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SwipeButton from "rn-swipe-button";
import { Link, Redirect, useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/welcomeBG.jpg")}
      style={{
        height: hp("100%"),
        width: wp("100%"),
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {/* <Wall /> */}
      <ImageBackground
        source={require("../assets/images/wall4.jpg")}
        style={{
          backgroundColor: "white",
          // height: hp("35%"),
          width: wp("100%"),
          borderTopRightRadius: wp("10%"),
          borderTopLeftRadius: wp("10%"),
          paddingTop: wp("7%"),
          overflow: "hidden",
        }}
      >
        <View style={{ paddingBottom: hp("3%") }}>
          <Text
            style={{
              color: "white",
              fontSize: hp("5%"),
              fontFamily: "hubbali",
              fontWeight: "600",
              paddingHorizontal: wp("15%"),
            }}
          >
            Welcome to
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: hp("2%"),
              fontFamily: "hubbali",
              textAlign: "left",
              paddingStart: wp("10%"),
              paddingTop: wp("22%"),
              paddingBottom: hp("2%"),
            }}
          >
            Join a global community of artists,{"\n"}producers, and music
            lovers.
          </Text>
          <View style={{ paddingHorizontal: wp("7%") }}>
            <SwipeButton
              //disableResetOnTap
              thumbIconBackgroundColor="#FFFFFF"
              railBackgroundColor="#dcdcdc1a"
              railStyles={{
                backgroundColor: "#dcdcdc1a",
                borderColor: "#dcdcdc1a",
              }}
              title="Get Started"
              onSwipeSuccess={() => {
                // router.push("auth");
                //router.replace("/(tabs)/home"); // cannot back
                // router.push("/auth/welcome");
                router.replace("/auth/welcome");
              }}
              // thumbIconSize={30}
              //railHeight={20}
              titleStyles={{
                color: "#FFFFFF",
                fontSize: hp("2%"),
                // fontWeight: "bold",
                fontFamily: "poppins",
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  );
};

export default Index;

const styles = StyleSheet.create({
  TEST: {
    color: "#000000",
  },
});
