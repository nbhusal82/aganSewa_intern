import { indexSlice } from "./indexSlice";

export const branchApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvience: builder.query({
      query: () => ({
        url: `/branch/`,
        method: "GET",
      }),
      providesTags: ["provience"],
    }),
    addProvience: builder.mutation({
      query: (data) => ({
        url: `/branch/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["provience"],
    }),

    deleteprovience: builder.mutation({
      query: (id) => ({
        url: `/branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["provience"],
    }),

    getProvienceById: builder.query({
      query: (id) => ({
        url: `/branch/getprovienceid/${id}`,
        method: "GET",
      }),
      providesTags: ["provience"],
    }),

    getBranches: builder.query({
      query: () => ({
        url: "/branch/getbranch",
        method: "GET",
      }),
      providesTags: ["branch"],
    }),
    addbranch: builder.mutation({
      query: (data) => ({
        url: "/branch/addbranch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),
    updatebranch: builder.mutation({
      query: (data) => ({
        url: `/branch/updatebranch/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),
    deletebranch: builder.mutation({
      query: (id) => ({
        url: `/branch/deletebranch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branch"],
    }),
    getBranchesByDistrict: builder.query({
      query: (districtId) => ({
        url: `/branch/getbranchbydistrict/${districtId}`,
        method: "GET",
      }),
      providesTags: ["branch"],
    }),
  }),
});
export const {
  useAddProvienceMutation,
  useGetProvienceQuery,
  useDeleteprovienceMutation,
  useGetProvienceByIdQuery,
  useAddbranchMutation,
  useGetBranchesQuery,
  useDeletebranchMutation,
  useUpdatebranchMutation,
} = branchApi;
