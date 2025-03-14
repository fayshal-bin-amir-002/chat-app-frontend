import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefeshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  // if (result.error?.status === 404) {
  //   toast.error("User not found!");
  // }

  if (result.error?.status === 401 || result.error?.status === 403) {
    api.dispatch(logout());
    // const res = await fetch("https://chat-app-backend-production-ec7b.up.railway.app/api/v1/auth/refresh-token", {
    //   method: "POST",
    //   credentials: "include",
    // });

    // const data = await res.json();

    // if (data?.data?.accessToken) {
    //   const user = (api.getState() as RootState).auth.user;
    //   api.dispatch(
    //     setUser({
    //       user,
    //       token: data.data.accessToken,
    //     })
    //   );

    //   result = await baseQuery(args, api, extraOptions);
    // } else {
    //   api.dispatch(logout());
    // }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefeshToken,
  tagTypes: ["Profile"],
  endpoints: () => ({}),
});
