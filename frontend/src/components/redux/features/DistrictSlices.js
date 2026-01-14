import { indexSlice } from "./Index";

const districtApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getdistrict: builder.query({
      query: () => ({
        url: "/branch/getalldistrict",
        method: "GET",
      }),
      providesTags: ["district"],
    }),
    getbranchbydistrict: builder.query({
      query: (id) => ({
        url: `/branch/branchdistrict/${id}`,
        method: "GET",
      }),
      providesTags: ["district"],
    }),
    getservicebybranch: builder.query({
      query: (id) => ({
        url: `/service/publicservice/${id}`,
        method: "GET",
      }),
      providesTags: ["district"],
    }),
  }),
});
export const {
  useGetdistrictQuery,
  useGetbranchbydistrictQuery,
  useGetservicebybranchQuery,
} = districtApi;
