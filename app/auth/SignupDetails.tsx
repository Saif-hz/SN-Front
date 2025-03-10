import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Animated,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSignupUserMutation } from "../../store/apiSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SignupDetails = () => {
  const { email, nom, prenom, username, password, userType } =
    useLocalSearchParams();
  const [genres, setGenres] = useState("");
  const [talents, setTalents] = useState("");
  const [studioName, setStudioName] = useState("");
  const [signupUser, { isLoading }] = useSignupUserMutation();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = async () => {
    if (userType === "artist") {
      if (!genres.trim()) {
        Alert.alert("Error", "Please enter at least one genre.");
        return;
      }
      if (!talents.trim()) {
        Alert.alert("Error", "Please enter at least one talent.");
        return;
      }
    }

    if (userType === "producer" && !studioName.trim()) {
      Alert.alert("Error", "Please enter the studio name.");
      return;
    }

    const newUser = {
      email,
      nom,
      prenom,
      username,
      password,
      user_type: userType,
      genres: genres ? genres.split(",").map((g) => g.trim()) : [],
      talents:
        userType === "artist" ? talents.split(",").map((t) => t.trim()) : [],
      studio_name: userType === "producer" ? studioName.trim() : null,
    };

    try {
      console.log("Sending signup request:", newUser);
      const response = await signupUser(newUser).unwrap();
      console.log("Signup Success:", response);

      Alert.alert("Success", `${userType} account created successfully!`);
      router.replace("/auth/login");
    } catch (error: any) {
      console.error("Signup Error:", error);
      Alert.alert("Error", error?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/darkmodebg.png")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <Text style={styles.title}>Complete Your Profile</Text>

          {/* Genres */}
          <TextInput
            placeholder="Genres (e.g. Pop, Jazz, Hip-Hop)"
            style={styles.input}
            value={genres}
            onChangeText={setGenres}
            autoCapitalize="words"
            placeholderTextColor="#D1C4E9"
          />

          {/* Talents (Only for Artists) */}
          {userType === "artist" && (
            <TextInput
              placeholder="Talents (e.g. Singer, Guitarist, DJ)"
              style={styles.input}
              value={talents}
              onChangeText={setTalents}
              autoCapitalize="words"
              placeholderTextColor="#D1C4E9"
            />
          )}

          {/* Studio Name (Only for Producers) */}
          {userType === "producer" && (
            <TextInput
              placeholder="Studio Name (e.g. SoundWave Studio)"
              style={styles.input}
              value={studioName}
              onChangeText={setStudioName}
              autoCapitalize="words"
              placeholderTextColor="#D1C4E9"
            />
          )}

          {/* Signup Button */}
          <Pressable
            style={[styles.signupButton, isLoading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupText}>
              {isLoading ? "Signing up..." : "Finish"}
            </Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  );
};

export default SignupDetails;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp("85%"),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("5%"),
  },
  title: {
    color: "#FFE3FF",
    fontSize: hp("4%"),
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: hp("3%"),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: "100%",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 1.5,
    color: "white",
    fontSize: 16,
    marginBottom: hp("2%"),
  },
  signupButton: {
    backgroundColor: "#A971B3",
    height: hp("6%"),
    width: wp("48%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    marginTop: hp("3%"),
    borderColor: "#FFFFFF",
  },
  signupText: {
    color: "white",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
