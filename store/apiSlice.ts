import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.148.66:8000/api/auth/", // ✅ Your backend API base URL
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (userData) => ({
        url: "signup/",
        method: "POST",
        body: userData,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "profile/update/",
        method: "PUT",
        body: profileData,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

// ✅ Make sure to export `useUpdateProfileMutation`
export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useUpdateProfileMutation,
} = apiSlice;
