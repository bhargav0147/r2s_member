import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Navigate to='/find-business' replace />
      ),
    },
    {
      path: '/dashboard',
      element: (
        <Navigate to='/find-business' replace />
      ),
    },

    // Auth routes
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,


    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
