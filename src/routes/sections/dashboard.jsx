import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import ProductCreatePage from 'src/pages/dashboard/product/new';
import PromotionPage from 'src/pages/dashboard/promotion/PromotionPage';

import { LoadingScreen } from 'src/components/loading-screen';

import AskHelp from 'src/pages/dashboard/ask/AskHelp';
import AskHelpself from 'src/pages/dashboard/ask/AskHelpSelf';
import AskHelps from 'src/pages/dashboard/ask/AskViewsById';
import SupportPage from 'src/pages/dashboard/suport/SuportPage';
import CheckoutOrderComplete from 'src/sections/checkout/checkout-order-complete';
import CheckoutOrderRejected from 'src/sections/checkout/checkout-order-rejected';
import PaymentFailed from 'src/sections/checkout/payment-failed';
import PaymentSuccess from 'src/sections/checkout/payment-success';
import { OverviewEcommerceView } from 'src/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));

const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));


// Service pages
const ServiceListPage = lazy(() => import('src/pages/dashboard/service/list'))
const ServiceDetailPage = lazy(() => import('src/pages/dashboard/service/details'))

// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));

// Find business
const FindBusiness = lazy(() => import('src/pages/dashboard/find-business/FindBusiness'));
const FindProduct = lazy(() => import('src/pages/dashboard/find-product/FindProduct'));
const FindService = lazy(() => import('src/pages/dashboard/find-service/FindService'));
const BusinessProfile = lazy(() => import('src/pages/dashboard/business/BusinessProfile'));
const MyBusiness = lazy(() => import('src/pages/dashboard/business/MyBusiness'));
const Referal = lazy(() => import('src/pages/dashboard/referal/Referal'));
const MembershipPage = lazy(() => import('src/pages/dashboard/membership/MembershipPage'));
const ProductDetailsPage = lazy(() => import('src/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));


// withdraw
const WithdrawListPage = lazy(() => import('src/pages/dashboard/withdraw/list'))

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <Navigate to="/find-business" />, index: true },
      {
        path: 'find-business',
        children: [{ element: <FindBusiness />, index: true }],
      },
      {
        path: 'find-service',
        children: [{ element: <FindService />, index: true }],
      },
      {
        path: 'find-product',
        children: [{ element: <FindProduct />, index: true }],
      },

      {
        path: 'business',
        children: [{ path: ':id', element: <BusinessProfile /> }],
      },
      {
        path: 'my-business',
        children: [
          { element: <MyBusiness />, index: true },
          // { path: 'profile', element: <UserProfilePage /> },
        ],
      },

      {
        path: 'manage-business',
        children: [{ element: <UserAccountPage />, index: true }],
      },

      {
        path: 'withdrawl',
        children: [
          { element: <WithdrawListPage />, index: true },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },

      {
        path: 'support',
        children: [
          { element: <SupportPage />, index: true },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'wallet',
        children: [
          { element: <IndexPage />, index: true },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },

      {
        path: 'membership',
        children: [
          { element: <MembershipPage />, index: true },
          { path: 'payment/success', element: <PaymentSuccess /> },
          { path: 'payment/failed', element: <PaymentFailed /> },
        ]
      },
      { path: 'promotion', element: <PromotionPage /> },
      { path: 'ask', element: <AskHelp isself={false}/> },
      { path: 'myask', element: <AskHelpself isself={true} /> },
      { path: 'ask/:id', element: <AskHelps  /> },
      { path: 'myask/:id', element: <AskHelps  /> },
      { path: 'ecommerce', element: <OverviewEcommerceView /> },
      {
        path: 'my-order', children: [
          { element: <OrderListPage isMyOrder />, index: true },
          { path: ':id', element: <OrderDetailsPage isMyOrder /> }
        ]
      },
      {
        path: 'order-history',
        children: [
          { element: <OrderListPage isOrder />, index: true },
          { path: ':id', element: <OrderDetailsPage isOrder /> },
        ],
      },
      {
        path: 'my-service',
        children: [
          { element: <ServiceListPage isMyService />, index: true },
          { path: ':id', element: <ServiceDetailPage isMyService /> },
        ]
      }, {
        path: 'service-history',
        children: [
          { element: <ServiceListPage isService />, index: true },
          { path: ':id', element: <ServiceDetailPage isService /> },
        ]
      },
      {
        path: 'add-product',
        children: [
          { element: <ProductCreatePage isService={false} />, index: true },
          { path: ':id', element: <ProductCreatePage isService={false} /> },
        ],
      },

      {
        path: 'service',
        children: [
          { path: ':id', element: <ProductDetailsPage isService /> },
          { path: 'checkout/success', element: <CheckoutOrderComplete /> },
          { path: 'checkout/failed', element: <CheckoutOrderRejected /> },
        ],
      },

      {
        path: 'product',
        children: [
          // { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage isProduct /> },
          { path: 'checkout', element: <ProductCheckoutPage /> },
          { path: 'checkout/success', element: <CheckoutOrderComplete /> },
          { path: 'checkout/failed', element: <CheckoutOrderRejected /> },
        ],
      },
      {
        path: 'add-service',
        children: [
          { element: <ProductCreatePage isService />, index: true },
          { path: ':id', element: <ProductCreatePage isService /> },
        ],
      },
      // { path: 'referal', element: <Referal /> },
    ],
  },
];
