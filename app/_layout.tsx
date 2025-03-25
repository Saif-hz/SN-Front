import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ImageBackground, View } from "react-native";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useDispatch } from "react-redux";
import { restoreSession } from "../store/authSlice";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Import background images for dark and light mode
const lightBackground = require("../assets/images/lightmodebg.png");
const darkBackground = require("../assets/images/darkmodebg.png");

function AppContent(): JSX.Element {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreTokens = async () => {
      try {
        console.log("Attempting to restore tokens...");
        const [accessToken, refreshToken, username, userStr] = await Promise.all([
          AsyncStorage.getItem("accessToken"),
          AsyncStorage.getItem("refreshToken"),
          AsyncStorage.getItem("username"),
          AsyncStorage.getItem("user"),
        ]);

        console.log("Retrieved tokens:", { accessToken, refreshToken, username });

        const user = userStr ? JSON.parse(userStr) : null;

        if (accessToken && refreshToken && username) {
          console.log("Restoring session with tokens...");
          dispatch(
            restoreSession({
              accessToken,
              refreshToken,
              user,
              username,
            })
          );
        } else {
          console.log("No valid tokens found, user needs to login");
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      }
    };

    restoreTokens();
  }, [dispatch]);

  return (
    <ImageBackground
      source={colorScheme === "dark" ? darkBackground : lightBackground}
      style={{ flex: 1 }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} />
          </Stack>
        </View>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </ImageBackground>
  );
}

export default function RootLayout(): JSX.Element | undefined {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    hubbali: require("../assets/fonts/Hubballi-Regular.ttf"),
    poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    poppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    poppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return undefined;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
