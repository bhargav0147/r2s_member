import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';

import { SplashScreen } from 'src/components/loading-screen';
import ChangePasswordPage from 'src/pages/auth/jwt/change-password';


// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const JWTForgotPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title=" ">
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },

    {
      path: 'forgot-password',
      element: (
        <CompactLayout>
          <JWTForgotPasswordPage />
        </CompactLayout>
      ),
    },

    {
      path: 'change-password',
      element: (
        <CompactLayout>
          <ChangePasswordPage />
        </CompactLayout>
      ),
    },
  ],
};


export const authRoutes = [
  {
    path: 'auth',
    children: [ authJwt],
  },
];
