import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useGetUserProfileQuery } from "../../store/apiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";

const Profile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    fetchUsername();
  }, []);

  // Fetch user data only if `username` is available
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserProfileQuery(username || "", { skip: !username });

  // Handle Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // ✅ Clear user data
      router.replace("/auth/login"); // ✅ Navigate to Login Page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Loading state
  if (isLoading || !username) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#817AD0" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load profile. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Cover Photo */}
      <View style={styles.coverContainer}>
        <Image
          source={
            user?.coverPhoto
              ? { uri: user.coverPhoto }
              : require("../../assets/images/placeholdercover.png")
          }
          style={styles.coverPhoto}
        />
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.profile_picture
              ? { uri: user.profile_picture }
              : require("../../assets/images/profileplaceholder.jpg")
          }
          style={styles.profilePic}
        />
        <Text style={styles.username}>
          {user?.nom} {user?.prenom}
        </Text>

        {/* User Type Displayed Below Username */}
        <Text style={styles.userType}>
          {user?.user_type
            ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)
            : "Unknown"}
        </Text>

        <Text style={styles.bio}>{user?.bio || "Music Enthusiast"}</Text>

        {/* Location */}
        {user?.location && (
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={16} color="#817AD0" />
            <Text style={styles.location}>{user?.location}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.likes || 0}K</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            height: 35,
            width: 40,
            backgroundColor: "#FFFFFF",
            top: 30,
            right: 83,
            zIndex: 999,
            borderTopEndRadius: 200,
            borderBottomStartRadius: 200,
            borderTopStartRadius: 50,
            borderBottomEndRadius: 50,
            borderRadius: 1,
            transform: [{ rotate: "45deg" }],
          }}
        />

        {/* Edit & Add Friend Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => router.push("/profile/EditProfile")}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
          <TouchableOpacity style={styles.addFriendButton}>
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
        {/* ✅ Logout Button Below Profile Actions */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Section */}
      <View style={styles.postsContainer}>
        <Text style={styles.sectionTitle}>Posts</Text>
        {user?.posts?.length > 0 ? (
          <FlatList
            data={user.posts}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.postItem}>
                <Image source={{ uri: item.image }} style={styles.postImage} />
              </View>
            )}
          />
        ) : (
          <Text style={styles.noPostsText}>No posts yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  coverContainer: {
    width: "100%",
    height: hp("25%"),
    overflow: "hidden",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  profileSection: {
    alignItems: "center",
    marginTop: -hp("8%"),
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 80,
    borderWidth: 7,
    borderColor: "#FFFFFF",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  userType: {
    fontSize: 16,
    color: "#817AD0",
    fontWeight: "bold",
    marginTop: 5,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    marginTop: hp("1%"),
    textAlign: "center",
    paddingHorizontal: wp("10%"),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  location: {
    color: "#817AD0",
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 15,
  },
  editButton: {
    backgroundColor: "#817AD0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addFriendButton: {
    backgroundColor: "#817AD0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addFriendText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  postsContainer: {
    marginTop: 20,
    paddingHorizontal: wp("5%"),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  postItem: {
    width: wp("35%"),
    height: hp("20%"),
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  noPostsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
