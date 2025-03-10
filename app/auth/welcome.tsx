import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const _layout = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../../assets/images/bgbg.png")}
      style={{
        height: hp("100%"),
        width: wp("100%"),
        justifyContent: "flex-end",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: wp("100%"),
          marginTop: hp("2.5%"),
          gap: hp("3%"),
          paddingBottom: hp("7.5%"),
        }}
      >
        <Pressable
          onPress={() => router.push("/auth/login")}
          style={{
            backgroundColor: "#384454",
            width: wp("80%"),
            borderColor: "white",
            borderWidth: 1,
            borderRadius: wp("50%"),
            paddingVertical: hp("2.25%"),
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontFamily: "poppinsSemiBold",
              opacity: 1,
            }}
          >
            Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/auth/profile")}
          style={{
            backgroundColor: "#817AD0",
            width: wp("80%"),
            borderColor: "white",
            borderWidth: 1,
            borderRadius: wp("50%"),
            paddingVertical: hp("2.25%"),
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "poppinsSemiBold",
            }}
          >
            Signup
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default _layout;

const styles = StyleSheet.create({});
