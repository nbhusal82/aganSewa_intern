import { indexSlice } from "./indexSlice";

const districtApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getdistrict: builder.query({
      query: () => ({
        url: `/branch/get-dis`,
        method: "GET",
      }),
      providesTags: ["district"],
    }),
    adddistrict: builder.mutation({
      query: (data) => ({
        url: `/branch/add-dis`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["district"],
    }),
    updatedistrict: builder.mutation({
      query: (data) => ({
        url: `/branch/update-dis/${data.id}`,
        method: "PATCH",
        body: { district_name: data.district_name, province_id: data.province_id },
      }),
      invalidatesTags: ["district"],
    }),
    deletedistrict: builder.mutation({
      query: (id) => ({
        url: `/branch/delete-dis/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["district"],
    }),
  }),
});
export const {
  useAdddistrictMutation,
  useGetdistrictQuery,
  useUpdatedistrictMutation,
  useDeletedistrictMutation,
} = districtApi;
