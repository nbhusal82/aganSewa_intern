import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/profile',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/password',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetProfileQuery,
  useUpdateProfileMutation, 
  useChangePasswordMutation 
} = profileApi;