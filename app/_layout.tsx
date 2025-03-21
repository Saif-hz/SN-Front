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

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "../store/store"; // Import Redux store

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Import background images for dark and light mode
const lightBackground = require("../assets/images/lightmodebg.png");
const darkBackground = require("../assets/images/darkmodebg.png");

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    return null;
  }

  return (
    <Provider store={store}>
      {/* Apply dark or light mode background */}
      <ImageBackground
        source={colorScheme === "dark" ? darkBackground : lightBackground}
        style={{ flex: 1 }}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
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
    </Provider>
  );
}
