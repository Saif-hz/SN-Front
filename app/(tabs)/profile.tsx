import React, { useCallback, useState } from "react";
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
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useGetUserProfileQuery } from "../../store/apiSlice";

const Profile = () => {
  const { email } = useLocalSearchParams(); // Retrieve user email
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useGetUserProfileQuery(email || "default@example.com");

  // Handle Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#817AD0" />
        <Text>Loading profile...</Text>
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
      <Image
        source={
          user?.coverPhoto
            ? { uri: user.coverPhoto }
            : require("../../assets/images/flouu.jpg")
        }
        style={styles.coverPhoto}
      />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.profile_picture
              ? { uri: user.profile_picture }
              : require("../../assets/images/picpro.jpg")
          }
          style={styles.profilePic}
        />
        <Text style={styles.username}>
          {user?.nom} {user?.prenom}
        </Text>
        <Text style={styles.role}>{user?.bio || "Music Enthusiast"}</Text>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={16} color="#817AD0" />
          <Text style={styles.location}>{user?.location || "Unknown"}</Text>
        </View>
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
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addFriendButton}>
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts Section */}
      <View style={styles.postsContainer}>
        <Text style={styles.sectionTitle}>Posts</Text>
        <FlatList
          data={user?.posts || []}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <Image source={{ uri: item.image }} style={styles.postImage} />
            </View>
          )}
        />
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
  coverContainer: {
    width: "100%",
    height: hp("25%"),
    overflow: "hidden",
  },
  coverPhoto: {
    width: "100%",
    height: hp("30%"),
  },
  profileSection: {
    alignItems: "center",
    marginTop: -hp("8%"), // Moves profile picture up
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
  role: {
    fontSize: 16,
    color: "gray",
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
});
