import { indexSlice } from "./Index";

const districtApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getdistrict: builder.query({
      query: () => ({
        url: `/branch/get-dis`,
        method: "GET",
      }),
      providesTags: ["district"],
    }),
  }),
});
export const { useGetdistrictQuery } = districtApi;
