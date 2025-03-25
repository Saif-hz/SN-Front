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
import { useLoginUserMutation } from "../../store/apiSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import GoogleButton from "../../components/GoogleButton";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice"; // ✅ Import action to store token in Redux

const API_BASE_URL = "http://192.168.1.23:8000";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // ✅ Redux Dispatch for storing token
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const userType = "defaultUserType";
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      console.log("Login Request:", {
        url: `${API_BASE_URL}/api/auth/login/`,
        body: { email }
      });
      
      // ✅ Call login API
      const response = await loginUser({ email, password }).unwrap();
      console.log("Login Response:", response);

      // ✅ Extract user data from API response
      const { access, refresh, username, profile_picture, user_type } = response;

      if (!username || !access || !refresh) {
        console.error("Login Error: Missing required data in response");
        Alert.alert("Error", "Invalid response: Missing required data.");
        return;
      }

      // ✅ Clear any existing tokens first
      await AsyncStorage.multiRemove(["accessToken", "refreshToken", "username", "user"]);

      // ✅ Save Tokens & User Info to AsyncStorage
      await AsyncStorage.multiSet([
        ["accessToken", access],
        ["refreshToken", refresh],
        ["username", username],
        ["user", JSON.stringify({ username, profile_picture, user_type })]
      ]);

      // ✅ Save to Redux State
      dispatch(
        setCredentials({
          accessToken: access,
          refreshToken: refresh,
          user: { username, profile_picture, user_type },
          username,
        })
      );

      // ✅ Alert Success
      Alert.alert("Success", "Login successful!");

      // ✅ Navigate to Profile Page (Using Username Instead of Email)
      router.replace({
        pathname: "/profile",
        params: { username },
      });
    } catch (error: any) {
      console.error("Login Error Full:", {
        error,
        data: error?.data,
        status: error?.status,
        message: error?.message,
      });

      // ✅ Handle Different API Error Responses
      const errorMessage = error?.data?.error || 
                          error?.data?.detail || 
                          error?.message ||
                          "Login failed. Please check your credentials.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../assets/images/flouu.jpg")}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#FFFFFF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              style={styles.passwordInput}
              placeholderTextColor="#FFFFFF"
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
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button with Gradient */}
        <Pressable onPress={handleLogin} disabled={isLoading}>
          <LinearGradient
            colors={["#FFFFFF", "#817AD0"]}
            start={{ x: 0, y: 3 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.loginButton, { opacity: isLoading ? 0.5 : 1 }]}
          >
            <Text style={styles.loginText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Signup Button */}
        <Pressable onPress={() => router.push("/auth/signup")}>
          <LinearGradient
            colors={["#FFFFFF", "#817AD0"]}
            start={{ x: 1, y: 5 }}
            end={{ x: 0, y: 0.5 }}
            style={styles.signupButton}
          >
            <Text style={styles.signupText}>Signup</Text>
          </LinearGradient>
        </Pressable>

        {/* Google Login Button */}
        <GoogleButton
          onPress={() => Alert.alert("Google Signup", "Coming soon!")}
        />
      </Animated.View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  container: {
    width: wp("85%"),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#ffe3ff",
    fontSize: hp("4%"),
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: hp("8%"),
  },
  inputContainer: {
    width: "100%",
    gap: hp("2%"),
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
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
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
  loginButton: {
    height: hp("6%"),
    width: wp("85%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    marginTop: hp("3%"),
  },
  loginText: {
    color: "white",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: hp("2%"),
    height: hp("6%"),
    width: wp("85%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
  },
  signupText: {
    color: "white",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
});
