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
import { LinearGradient } from "expo-linear-gradient"; // ✅ Import for gradient buttons
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
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
      const response = await loginUser({ email, password }).unwrap();
      Alert.alert("Success", "Login successful!");
      router.replace({
        pathname: "/auth/profile",
        params: { email: email, userType: userType },
      });
    } catch (error) {
      Alert.alert("Error", error?.data?.error || "Login failed. Try again.");
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
            placeholderTextColor="#FFFFFF" // ✅ Increased contrast
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              style={styles.passwordInput}
              placeholderTextColor="#FFFFFF" // ✅ Increased contrast
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
                color="#FFFFFF" // ✅ Increased contrast
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button with Gradient */}
        <Pressable onPress={handleLogin} disabled={isLoading}>
          <LinearGradient
            colors={["#FFFFFF", "#817AD0"]} // ✅ Gradient from White to Custom Color
            start={{ x: 0, y: 3 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.loginButton, { opacity: isLoading ? 0.5 : 1 }]}
          >
            <Text style={styles.loginText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Signup Button with Gradient */}
        <Pressable onPress={() => router.push("/auth/signup")}>
          <LinearGradient
            colors={["#FFFFFF", "#817AD0"]} // ✅ Gradient from White to Custom Color
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
    backgroundColor: "rgba(255, 255, 255, 0.15)", // ✅ Same as Signup
    width: "100%",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 1.5, // ✅ Consistent border width
    color: "white",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)", // ✅ Same as Signup
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
