import { indexSlice } from "./indexSlice";

export const authApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      providesTags: ["auth"],
    }),
  }),
});
export const { useLoginMutation } = authApi;
