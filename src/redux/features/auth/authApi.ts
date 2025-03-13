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
    getAUser: builder.query({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    findUser: builder.query({
      query: (query: string) => {
        const params = new URLSearchParams();
        if (query) params.append("user", query);
        return {
          url: `/users/find-user`,
          method: "GET",
          params: params,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useGetAllUserQuery,
  useGetAUserQuery,
  useFindUserQuery,
} = authApi;
