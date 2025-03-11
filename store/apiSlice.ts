import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store"; // ✅ Import RootState

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.33.66:8000/api/auth/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState; // ✅ Explicitly define the type
      const token = state.auth?.accessToken; // ✅ Now TypeScript understands `auth`

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["UserProfile"], // ✅ Define "UserProfile" tag here

  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (userData) => ({
        url: "signup/",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserProfile: builder.query({
      query: (username) => `profile/${username}/`, // ✅ Fetch user by username
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "profile/update/",
        method: "PUT",
        body: profileData,
        formData: true, // ✅ Enable multipart/form-data
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useUpdateProfileMutation,
  useGetUserProfileQuery,
} = apiSlice;
