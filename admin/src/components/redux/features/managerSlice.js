import { indexSlice } from "./indexSlice";

export const managerApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: "/service/get",
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    addService: builder.mutation({
      query: (data) => ({
        url: "/service",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["service"],
    }),
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/service/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["service"],
    }),
    getStaffs: builder.query({
      query: () => ({
        url: "/staff",
        method: "GET",
      }),
      providesTags: ["staff"],
    }),
    addStaff: builder.mutation({
      query: (data) => ({
        url: "/staff",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["staff"],
    }),
    updateStaff: builder.mutation({
      query: ({ id, data }) => ({
        url: `/staff/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["staff"],
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["staff"],
    }),
    getGallery: builder.query({
      query: () => ({
        url: "/site/gallery/get",
        method: "GET",
      }),
      providesTags: ["gallery"],
    }),
    addGallery: builder.mutation({
      query: (data) => ({
        url: "/site/gallery",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gallery"],
    }),
    updateGallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/site/gallery/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["gallery"],
    }),
    deleteGallery: builder.mutation({
      query: (id) => ({
        url: `/site/gallery/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallery"],
    }),
    getInquiries: builder.query({
      query: () => ({
        url: "/site",
        method: "GET",
      }),
      providesTags: ["inquiry"],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/site/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["inquiry"],
    }),
  }),
});

export const {
  useAddGalleryMutation,
  useAddServiceMutation,
  useAddStaffMutation,
  useDeleteGalleryMutation,
  useDeleteInquiryMutation,
  useDeleteServiceMutation,
  useDeleteStaffMutation,
  useGetGalleryQuery,
  useGetInquiriesQuery,
  useGetServicesQuery,
  useGetStaffsQuery,
  useUpdateGalleryMutation,
  useUpdateServiceMutation,
  useUpdateStaffMutation,
} = managerApi;
