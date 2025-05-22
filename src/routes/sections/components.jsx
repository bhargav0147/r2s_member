import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import MainLayout from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// FOUNDATION
const TypographyPage = lazy(() => import('src/pages/components/foundation/typography'));

// ----------------------------------------------------------------------

export const componentsRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      {
        path: 'components',
        children: [
          {
            path: 'foundation',
            children: [{ path: 'typography', element: <TypographyPage /> }],
          },
        ],
      },
    ],
  },
];
