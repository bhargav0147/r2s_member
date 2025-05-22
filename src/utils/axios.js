import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  earning: '/api/member/earning',
  masterReferal: ({ page, limit }) => `/api/member/referral/my?page=${page}&limit=${limit}`,
  payout: {
    history: '/api/member/payout/',
  },
  paymentRequest: '/api/create-payout-request',
  createPayment: '/api/member/payment/request',
  transaction: '/api/member/transaction/recent',
  createFeedback: '/api/create-feedback',

  uploadsingleImage: '/api/member/auth/update-single-picture',
  uploadProductImage: '/apidas-picture',
  uploadBusinessImage: '/api/member/business/picture/add',
  updateSetting: '/api/member/auth/update-profile',
  // updateBusiness: '/api//update-business',
  updateBusiness: '/api/member/business/update',
  updateSocialLink: '/api/member/business/social/update',
  changePassword: '/api/member/auth/change-password',

  // manageShippingFees: '/api/member/business/shipping'
  updateShippingFee: '/api/member/business/shipping',
  getShippingFee: '/api/member/business',

  // getService
  getSingleService: (id) => `api/member/ecommerce/service/${id}`,
  getSingleProduct: (id) => `api/member/ecommerce/product/${id}`,
  sharedProfile: (id) => `/api/common/get-shared-profile?username=${id}`,

  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/member/auth/me',
    login: '/api/member/auth/login',
    register: '/api/member/auth/register',
    validate: '/api/member/auth/validate',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
    topRated: ({ state, city, pincode ,search }) =>
      `/api/member/ecommerce/product/top-rated?state=${state}&city=${city}&pincode_or_area=${pincode}&search=${search}`,
  },
  services: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
    topRated: ({ state, city, pincode ,search }) =>
      `/api/member/ecommerce/service/top/rated?state=${state}&city=${city}&search=${search}`,
  },

  business: {
    topRated: '/api/member/business/top-rated?page=1',
    fetchDetails: (id) => `/api/member/business/${id}`,
  },
};
