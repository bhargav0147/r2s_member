import { Helmet } from 'react-helmet-async';

import Profile from './components/Profile';

const MyBusiness = () => (
  <>
    <Helmet>
      <title> Business Details</title>
    </Helmet>

    <Profile />
  </>
);

export default MyBusiness;
