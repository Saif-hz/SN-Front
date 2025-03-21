import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useGetExploreFeedQuery } from "@/store/apiSlice";
import { Music2, Heart, MessageCircle, Share2 } from "lucide-react-native";
import PostMedia from "@/components/PostMedia";

const Discover = () => {
  const { data: posts, isLoading, refetch } = useGetExploreFeedQuery({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

// ✅ Post Card Component
interface Post {
  id: number;
  user_avatar: string;
  username: string;
  user_type: string;
  content: string;
  media?: {
    type: "audio" | "image" | "video";
    url: string;
  };
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const PostCard = ({ post }: { post: Post }) => {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user_avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.username}</Text>
          <View style={styles.userTypeContainer}>
            <Music2 size={14} color="#6366f1" />
            <Text style={styles.userType}>{post.user_type}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.media && <PostMedia type={post.media.type} url={post.media.url} />}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={20} color="#ef4444" />
          <Text style={styles.actionText}>{post.likes_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color="#6366f1" />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <Text style={styles.timestamp}>{post.created_at}</Text>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  userTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userType: {
    fontSize: 14,
    color: "#6366f1",
    marginLeft: 4,
  },
  content: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: "#64748b",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
  },
});

export default Discover;
