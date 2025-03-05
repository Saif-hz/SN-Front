import { Stack } from "expo-router";

const AuthStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f0f0f0" },
        headerTintColor: "#000000",
        headerTitleStyle: { fontWeight: "regular" },
        animation: "fade",
        headerShown: false, // Hide headers for a clean UI
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthStackLayout;
