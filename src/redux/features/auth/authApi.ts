import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Profile"],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/users/register",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Profile"],
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users/getMe",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useGetAllUserQuery,
} = authApi;
