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

    deletedistrict: builder.mutation({
      query: (id) => ({
        url: `/branch/delete-dis/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["district"],
    }),
    getdistrictbyid: builder.query({
      query: (id) => ({
        url: `/branch/getdistrictid/${id}`,
        method: "GET",
      }),
      providesTags: ["district"],
    }),

    getmanager: builder.query({
      query: () => ({
        url: `/users/getmanager`,
        method: "GET",
      }),
      providesTags: ["manager"],
    }),
    addmanager: builder.mutation({
      query: (data) => ({
        url: `/users/addmanager`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["manager"],
    }),
    updatemanager: builder.mutation({
      query: (data) => ({
        url: `/users/updatemanager/${data.id}`,
        method: "PATCH",
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        },
      }),
      invalidatesTags: ["manager"],
    }),
    deletemanager: builder.mutation({
      query: (id) => ({
        url: `/users/deletemanager/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["manager"],
    }),
  }),
});
export const {
  useAdddistrictMutation,
  useGetdistrictQuery,
useGetdistrictbyidQuery,
  useDeletedistrictMutation,
  useAddmanagerMutation,
  useGetmanagerQuery,
  useUpdatemanagerMutation,
  useDeletemanagerMutation,
} = districtApi;
