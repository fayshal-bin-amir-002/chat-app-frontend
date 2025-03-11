import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: JSON.stringify(userInfo),
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/users/register",
        method: "POST",
        body: JSON.stringify(userInfo),
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
