import { Helmet } from 'react-helmet-async';

import ChangePasswordView from 'src/sections/auth/amplify/change-password-view';

// ----------------------------------------------------------------------

export default function ChangePasswordPage() {
  return (
    <>
      <Helmet>
        <title> Change Password</title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
