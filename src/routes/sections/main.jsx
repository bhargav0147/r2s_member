import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import CompactLayout from 'src/layouts/compact';
import MainLayout from 'src/layouts/main';
import PrivacyPolicy from 'src/pages/terms-condition/PrivacyPolicy';
import TermsCondition from 'src/pages/terms-condition/TermsCondition';

import { SplashScreen } from 'src/components/loading-screen';

const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const PaymentPage = lazy(() => import('src/pages/payment'));
const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));
// PRODUCT
const ProductListPage = lazy(() => import('src/pages/product/list'));
const ProductDetailsPage = lazy(() => import('src/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));

const PersonProfile = lazy(() => import('src/pages/dashboard/business/PersonProfile'));
const OrderInovoice = lazy(() => import('src/pages/order-inovoice'))

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
          {/* <AboutPage /> */}
        </Suspense>
      </MainLayout>
    ),
    children: [
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          // { path: ':id', element: <ProductDetailsPage /> },
          // { path: 'checkout', element: <ProductCheckoutPage /> },
        ],
      },
    ],
  },
  {
    element: (
      // <SimpleLayout>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
      // </SimpleLayout>
    ),
    children: [
      {
        path: 'member',
        children: [
          {
            path: ':id',
            element: (
              <div style={{ margin: '2rem 0' }}>
                <PersonProfile />
              </div>
            ),
          },
        ],
      },
      {
        path: 'terms&condition',
        element: (
          <div style={{ margin: '2rem 0' }}>
            <TermsCondition />
          </div>
        ),
      },
      {
        path: 'privacy-policy',
        element: (
          <div style={{ margin: '2rem 0' }}>
            <PrivacyPolicy />
          </div>
        ),
      },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'payment', element: <PaymentPage /> },

    ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      { path: 'coming-soon', element: <ComingSoonPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },

];
