import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#817AD0",
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 30,
            borderWidth: 0.5,
            height: 55,
            borderTopWidth: 0,
            elevation: 0,
            bottom: 30, // Move up from bottom
            left: 20,
            right: 20,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-circle-outline"}
                size={28}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating Button */}
      <CustomAddButton onPress={() => console.log("Add button pressed!")} />
    </View>
  );
}

/** Floating "+" Button Component */
const CustomAddButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.addButtonContainer}>
      <TouchableOpacity style={styles.addButton} onPress={onPress}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 70, // Adjust this to be above the tab bar
    alignSelf: "center",
    zIndex: 10, // Ensures it's above other components
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "#7E57C2",
    borderColor: "#FFFFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
