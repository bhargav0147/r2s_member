import { Helmet } from 'react-helmet-async';

import { UserProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------


export default function UserProfilePage() {
  return (
    <>
      <Helmet>
        <title> My Profile</title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
