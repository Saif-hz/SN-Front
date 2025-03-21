import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.90.66:8000/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers; // 🚀 Do NOT set `Content-Type` for FormData
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
    }),
    loginUser: builder.mutation<
      {
        access: string;
        refresh: string;
        username: string;
        profile_picture?: string;
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "api/auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // ✅ User Profile Management
    getUserProfile: builder.query({
      query: (username) => ({
        url: `api/auth/profile/${encodeURIComponent(username)}/`,
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "api/auth/profile/update/",
        method: "PUT",
        body: formData,
        formData: true, // ✅ Ensures correct content type for file uploads
      }),
      invalidatesTags: ["UserProfile"],
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
