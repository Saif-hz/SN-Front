import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useSignupUserMutation } from "../../store/apiSlice";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Icons for Google & Eye Toggle
import * as Font from "expo-font"; // Load custom font
import { useState as useFontState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("artist"); // Default user type
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [signupUser, { isLoading }] = useSignupUserMutation();
  const router = useRouter();

  // Animation for entrance fade-in effect
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load Hubballi Font
  const [fontLoaded, setFontLoaded] = useFontState(false);
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Hubballi: require("../../assets/fonts/Hubballi-Regular.ttf"), // Ensure the font is in assets/fonts
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    const newUser = {
      email: email,
      password: password,
      user_type: userType,
    };

    try {
      console.log("Sending request to signup:", newUser);
      const response = await signupUser(newUser).unwrap();
      console.log("Signup Successful:", response);

      Alert.alert(
        "Success",
        `${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } account created successfully!`
      );
      router.replace("/auth/login");
    } catch (error: any) {
      console.error("Signup Error:", error);
      const errorMessage =
        error?.data?.error || error?.message || "Signup failed. Try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert(
      "Google Signup",
      "Google signup authentication will be implemented."
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/welcomeBG.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Title with Hubballi Font */}
        {fontLoaded && <Text style={styles.title}>Create an Account</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#D1C4E9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              style={styles.passwordInput}
              placeholderTextColor="#D1C4E9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={24}
                color="#D1C4E9"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              style={styles.passwordInput}
              placeholderTextColor="#D1C4E9"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={
                  isConfirmPasswordVisible ? "visibility" : "visibility-off"
                }
                size={24}
                color="#D1C4E9"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userTypeContainer}>
          <Pressable
            style={[
              styles.userTypeButton,
              userType === "artist" && styles.selectedUserType,
            ]}
            onPress={() => setUserType("artist")}
          >
            <Text
              style={[
                styles.userTypeText,
                userType === "artist" && styles.selectedUserType,
              ]}
            >
              Artist
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.userTypeButton,
              userType === "producer" && styles.selectedUserType,
            ]}
            onPress={() => setUserType("producer")}
          >
            <Text
              style={[
                styles.userTypeText,
                userType === "producer" && styles.selectedUserType,
              ]}
            >
              Producer
            </Text>
          </Pressable>
        </View>

        {/* Signup Button (Larger) */}
        <Pressable
          style={[styles.signupButton, { opacity: isLoading ? 0.5 : 1 }]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.signupText}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </Text>
        </Pressable>

        {/* Google Signup Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignup}
        >
          <FontAwesome name="google" size={24} color="#DB4437" />
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
};

export default Signup;

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
  },
  title: {
    color: "#D1C4E9", // Light lavender instead of white
    fontSize: hp("5%"),
    textAlign: "center",
    fontFamily: "Hubballi",
    marginBottom: hp("4%"),
  },
  inputContainer: {
    width: "100%",
    gap: hp("2%"),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    borderColor: "#B89EFF",
    borderWidth: 1.5,
    color: "white",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp("5%"),
    borderColor: "#B89EFF",
    borderWidth: 1.5,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    color: "white",
    fontSize: 16,
  },
  eyeIcon: {
    paddingRight: wp("5%"),
  },
  signupButton: {
    backgroundColor: "#B89EFF",
    height: hp("6%"), // Bigger button
    width: wp("48%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    marginTop: hp("5%"),
  },
  signupText: {
    color: "white",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: hp("2%"),
  },
  userTypeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    borderRadius: wp("5%"),
    borderWidth: 1.5,
    borderColor: "#B89EFF",
    marginHorizontal: wp("1%"),
  },
  selectedUserType: {
    backgroundColor: "#7E57C2",
  },
  userTypeText: {
    color: "#D1C4E9",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: wp("5%"),
    height: hp("6.5%"),
    paddingHorizontal: wp("5%"),
    marginTop: hp("3%"),
  },
  googleButtonText: {
    color: "#3C4043",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: wp("3%"),
  },
});
