import { Helmet } from 'react-helmet-async';

import BusinessProfileView from './components/BusinessProfileView';

const BusinessProfile = () => (
  <>
    <Helmet>
      <title> Business Details</title>
    </Helmet>
    <BusinessProfileView />
  </>
);

export default BusinessProfile;
