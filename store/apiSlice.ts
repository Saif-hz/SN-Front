import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use environment variable or fallback to a default URL
const API_BASE_URL = "http://192.168.1.47:8000"; // Replace with your computer's IP address

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers: Headers, { getState, endpoint }) => {
      const state = getState() as RootState;
      const token = state.auth?.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Handle FormData endpoints
      if (endpoint === 'updateProfile' || endpoint === 'createPost') {
        // Remove Content-Type header for FormData requests
        headers.delete("Content-Type");
      } else {
        // Add Content-Type header for non-FormData requests
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
      }

      return headers;
    },
  }),
  tagTypes: ["UserProfile", "Posts"],

  endpoints: (builder) => ({
    // ✅ User Authentication
    signupUser: builder.mutation({
      query: (userData) => ({
        url: "api/auth/signup/",
        method: "POST",
        body: userData,
      }),
      // Add better error handling
      transformErrorResponse: (response: { status: number, data: any }) => {
        console.error("Signup Error Response:", response);
        if (response.status === 400) {
          return response.data;
        }
        if (response.status === 409) {
          return { error: "Username or email already exists" };
        }
        return { error: "An unexpected error occurred during signup" };
      },
    }),
    loginUser: builder.mutation<
      {
        access: string;
        refresh: string;
        username: string;
        profile_picture?: string;
        user_type: string;
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "api/auth/login/",
        method: "POST",
        body: credentials,
      }),
      // Add better error handling
      transformErrorResponse: (response: { status: number, data: any }) => {
        console.error("Login Error Response:", response);
        if (response.status === 401) {
          return { error: "Invalid credentials" };
        }
        if (response.status === 400) {
          return { error: "Please provide both email and password" };
        }
        if (response.status === 403) {
          return { error: "Account is not active" };
        }
        return { error: "An unexpected error occurred during login" };
      },
      // Add success handling
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Login successful:", data);
          // Store the token and username
          await AsyncStorage.setItem("accessToken", data.access);
          await AsyncStorage.setItem("username", data.username);
          console.log("Stored token and username");
        } catch (error) {
          console.error("Error storing login data:", error);
        }
      },
    }),

    // ✅ User Profile Management
    getUserProfile: builder.query({
      query: (username) => {
        console.log("Fetching profile for username:", username);
        return {
          url: `api/auth/profile/${encodeURIComponent(username.trim())}/`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        console.log("Profile Response:", response);
        // Handle profile picture URL
        if (response.profile_picture) {
          // If it's already a full URL, keep it as is
          if (response.profile_picture.startsWith('http')) {
            return response;
          }
          // If it starts with /media/, construct the full URL
          if (response.profile_picture.startsWith('/media/')) {
            response.profile_picture = `${API_BASE_URL}${response.profile_picture}`;
          } else {
            // If it's just a filename, construct the full URL with /media/profile_pics/
            response.profile_picture = `${API_BASE_URL}/media/profile_pics/${response.profile_picture}`;
          }
        }
        return response;
      },
      transformErrorResponse: (response: { status: number, data: any }) => {
        console.error("Profile Error Response:", response);
        if (response.status === 404) {
          return { error: "User not found. Please try logging in again." };
        }
        if (response.status === 401) {
          return { error: "Session expired. Please login again." };
        }
        return { error: "Failed to fetch user profile" };
      },
      providesTags: ["UserProfile"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => {
        // Log the FormData contents for debugging
        console.log("📤 Sending FormData contents:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        return {
          url: "api/auth/profile/update/",
          method: "PUT",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (response: any) => {
        console.log("Profile Update Response:", response);
        
        // If profile_picture is null but we sent one, try to get it from the user profile
        if (!response.profile_picture) {
          console.log("⚠️ No profile picture in response, attempting to fetch updated profile");
          // The profile picture might be available in the user profile endpoint
          return response;
        }

        // Handle profile picture URL
        if (response.profile_picture) {
          console.log("📸 Processing profile picture URL:", response.profile_picture);
          // If it's already a full URL, keep it as is
          if (response.profile_picture.startsWith('http')) {
            return response;
          }
          // If it starts with /media/, construct the full URL
          if (response.profile_picture.startsWith('/media/')) {
            response.profile_picture = `${API_BASE_URL}${response.profile_picture}`;
            console.log("📸 Constructed full URL:", response.profile_picture);
          } else {
            // If it's just a filename, construct the full URL with /media/profile_pics/
            response.profile_picture = `${API_BASE_URL}/media/profile_pics/${response.profile_picture}`;
            console.log("📸 Constructed full URL:", response.profile_picture);
          }
        }
        return response;
      },
      transformErrorResponse: (response: { status: number, data: any }) => {
        console.error("Profile Update Error:", response);
        if (response.status === 404) {
          return { error: "User profile not found" };
        }
        if (response.status === 401) {
          return { error: "Please login to update your profile" };
        }
        if (response.status === 413) {
          return { error: "File size too large. Please choose a smaller image." };
        }
        return { 
          error: response.data?.error || response.data?.detail || "Failed to update profile" 
        };
      },
      // Ensure cache is invalidated and refetched
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("✅ Profile update successful:", result.data);
          // Invalidate and refetch the profile data
          dispatch(apiSlice.util.invalidateTags([{ type: 'UserProfile' }]));
        } catch (error) {
          console.error('❌ Error in onQueryStarted:', error);
        }
      },
    }),

    // ✅ Password Reset
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "api/auth/forgot-password/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, code, new_password }) => ({
        url: "api/auth/reset-password/",
        method: "POST",
        body: { email, code, new_password },
      }),
    }),

    // ✅ Explore Feed (Get All Posts)
    getExploreFeed: builder.query({
      query: () => ({
        url: "feed/posts/",
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // ✅ Create Post (Supports Images/Videos)
    createPost: builder.mutation({
      query: (postData) => {
        const formData = new FormData();

        // ✅ Ensure content is NEVER empty
        const content = postData.content?.trim();
        if (!content && !postData.image) {
          throw new Error("Post content or media is required!");
        }

        formData.append("content", content || "");

        // ✅ Fix Image Upload (Ensure correct format)
        if (postData.image) {
          const localUri = postData.image.uri;
          const filename = localUri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename || "");
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("image", {
            uri: localUri,
            name: filename || "upload.jpg",
            type: type,
          } as any);
        }

        console.log("📤 Sending FormData:", formData);

        return {
          url: "feed/posts/create/",
          method: "POST",
          body: formData,
          formData: true, // ✅ Ensure correct `Content-Type`
        };
      },
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetExploreFeedQuery,
  useCreatePostMutation,
} = apiSlice;
