import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.204.66:8000/api/auth/",
  }), // ✅ Use your local IP
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
  }),
});

export const { useSignupUserMutation, useLoginUserMutation } = apiSlice;
